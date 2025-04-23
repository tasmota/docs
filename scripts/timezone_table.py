from importlib import resources
import math
import os
import re
import typing

import tzdata

try:
    import zoneinfo
except ImportError:
    from backports import zoneinfo


def iana_key_to_resource(key: str) -> typing.Tuple[str, str]:
    if "/" not in key:
        return "tzdata.zoneinfo", key

    package_loc, resource = key.rsplit("/", 1)
    package = "tzdata.zoneinfo." + package_loc.replace("/", ".")

    return package, resource


def offset_to_minutes(offset: str) -> int:
    offset_parts = offset.split(":")
    minutes = 0
    if len(offset_parts[0]):
        minutes += int(offset_parts[0]) * 60
    if len(offset_parts) > 1:
        minutes += math.copysign(int(offset_parts[1]), minutes)
    if len(offset_parts) > 2:
        minutes += math.copysign(round(int(offset_parts[2]) / 60), minutes)
    return minutes


class OffsetOutOfRangeError(Exception):
    pass


class DstRuleNotSupportedError(Exception):
    pass


class DstStartEndTimeNotWholeHourError(Exception):
    pass


def posix_tz_string_to_tasmota_command(posix_tz_string: str) -> str:
    # https://pubs.opengroup.org/onlinepubs/9699919799/
    # https://datatracker.ietf.org/doc/html/rfc8536#section-3.3.1
    parsed = re.match(
        r"(?P<std><[^>]{3,}>|[a-zA-Z]{3,})(?P<stdoffset>[\d:+-]+)(?:(?P<dst><[^>]{3,}>|[a-zA-Z]{3,})(?P<dstoffset>[\d:+-]+)?)?(?:,(?P<dst_start_date>[JM\d.]+)(?:/(?P<dst_start_time>[-\d:]+))?,(?P<dst_end_date>[JM\d.]+)(?:/(?P<dst_end_time>[-\d:]+))?)?",
        posix_tz_string,
    )
    assert parsed is not None
    assert (parsed.group("dst_start_date") is None) == (parsed.group("dst") is None)

    if parsed.group("dst") is None:
        # Fixed offset - needs only `Timezone ...` command

        # Negated as POSIX defines the offset from local to UTC, not the other way around
        fixed_offset_minutes = -offset_to_minutes(parsed.group("stdoffset"))
        if fixed_offset_minutes not in range(-13 * 60, 13 * 60 + 1):
            raise OffsetOutOfRangeError()
        return "Timezone %s" % (
            "%s%d:%02d"
            % (
                "+" if fixed_offset_minutes >= 0 else "-",
                math.floor(abs(fixed_offset_minutes) / 60),
                (fixed_offset_minutes) % 60,
            )
        )
    else:
        assert parsed.group("dst_start_date") is not None
        assert parsed.group("dst_end_date") is not None

        # Tasmota only supports this format of timezone rule (not the julian date formats)
        if (
            parsed.group("dst_start_date")[0] != "M"
            or parsed.group("dst_end_date")[0] != "M"
        ):
            raise DstRuleNotSupportedError()

        # Negated as POSIX defines the offset from local to UTC, not the other way around
        std_offset_minutes = -offset_to_minutes(parsed.group("stdoffset"))
        if parsed.group("dstoffset") is not None:
            dst_offset_minutes = -offset_to_minutes(parsed.group("dstoffset"))
        else:
            # Per POSIX, default DST offset is 1 hour ahead
            dst_offset_minutes = std_offset_minutes + 60

        if std_offset_minutes not in range(-13 * 60, 13 * 60 + 1):
            raise OffsetOutOfRangeError()
        if dst_offset_minutes not in range(-13 * 60, 13 * 60 + 1):
            raise OffsetOutOfRangeError()

        start_month, start_week, start_day = (
            int(x) for x in parsed.group("dst_start_date").strip("M").split(".")
        )
        if parsed.group("dst_start_time") is not None:
            start_offset = offset_to_minutes(parsed.group("dst_start_time"))
            if start_offset % 60 != 0:
                raise DstStartEndTimeNotWholeHourError()
            start_hour = int(start_offset / 60)
        else:
            # POSIX default changeover time is 2AM
            start_hour = 2

        end_month, end_week, end_day = (
            int(x) for x in parsed.group("dst_end_date").strip("M").split(".")
        )
        if parsed.group("dst_end_time") is not None:
            end_offset = offset_to_minutes(parsed.group("dst_end_time"))
            if end_offset % 60 != 0:
                raise DstStartEndTimeNotWholeHourError()
            end_hour = int(end_offset / 60)
        else:
            # POSIX default changeover time is 2AM
            end_hour = 2

        if start_hour not in range(0, 24) or end_hour not in range(0, 24):
            # These are rules defined as "the day before/after such-and-such day".
            raise DstRuleNotSupportedError()

        hemisphere = 1 if end_month < start_month else 0

        # Tasmota weekdays are 1-indexed
        start_day += 1
        end_day += 1

        # POSIX says the last week is week 5, Tasmota says it is week 0
        if start_week == 5:
            start_week = 0
        if end_week == 5:
            end_week = 0

        commands = [
            "Timezone 99",
            f"TimeStd {hemisphere},{end_week},{end_month},{end_day},{end_hour},{std_offset_minutes}",
            f"TimeDst {hemisphere},{start_week},{start_month},{start_day},{start_hour},{dst_offset_minutes}",
        ]
        # Combine into a single backlog line for copy-pastability
        return "Backlog0 %s" % "; ".join(commands)


# Some basic tests:
# Asia/Kabul
assert posix_tz_string_to_tasmota_command("<+0430>-4:30") == "Timezone +4:30"

# Pacific/Marquesas
assert posix_tz_string_to_tasmota_command("<-0930>9:30") == "Timezone -9:30"

# America/Toronto
assert (
    posix_tz_string_to_tasmota_command("EST5EDT,M3.2.0,M11.1.0")
    == "Backlog0 Timezone 99; TimeStd 0,1,11,1,2,-300; TimeDst 0,2,3,1,2,-240"
)

# Europe/Brussels
assert (
    posix_tz_string_to_tasmota_command("CET-1CEST,M3.5.0,M10.5.0/3")
    == "Backlog0 Timezone 99; TimeStd 0,0,10,1,3,60; TimeDst 0,0,3,1,2,120"
)

# US/Hawaii
assert (
    posix_tz_string_to_tasmota_command("HST10")
    == "Timezone -10:00"
)

# Pacific/Kiritmati
try:
    posix_tz_string_to_tasmota_command("<+14>-14")
    assert False
except OffsetOutOfRangeError:
    pass

# Pacific/Chatham
try:
    posix_tz_string_to_tasmota_command("<+1245>-12:45<+1345>,M9.5.0/2:45,M4.1.0/3:45")
    assert False
except OffsetOutOfRangeError:
    pass

# Asia/Tehran
try:
    posix_tz_string_to_tasmota_command("<+0330>-3:30<+0430>,J79/24,J263/24")
    assert False
except DstRuleNotSupportedError:
    pass

# Pacific/Fiji
try:
    posix_tz_string_to_tasmota_command("<+12>-12<+13>,M11.2.0,M1.2.3/99")
    assert False
except DstRuleNotSupportedError:
    pass

# No timezone curently triggers this error (Pacific/Chatham comes close, but fails earlier to to its >13 hour UTC offset)
try:
    posix_tz_string_to_tasmota_command("TEST0TEST,M9.5.0/2:45,M4.1.0/3:45")
    assert False
except DstStartEndTimeNotWholeHourError:
    pass

os.makedirs("docs/Commands", exist_ok=True)

with open("docs/Timezone-Table.md", "w") as doc_fh:
    doc_fh.write("<!-- DO NOT MODIFY - THIS FILE IS AUTOMATICALLY GENERATED! RUN scripts/timezone_table.py TO UPDATE -->\n")
    doc_fh.write("# Tasmota Timezone Table\n\n")
    doc_fh.write(
        "Use this table to look up the correct `Timezone`, `TimeStd`, and `TimeDst` commands to configure a Tasmota device for your local timezone.\n\n"
    )

    doc_fh.write("|Timezone|Commands|\n")
    doc_fh.write("|-|-|\n")
    for tz_key in sorted(zoneinfo.available_timezones()):
        if tz_key == "localtime":
            # This is not a real timezone
            continue
        with resources.open_binary(*iana_key_to_resource(tz_key)) as tzif_fh:
            # The last non-empty line of the file is the POSIX TZ string
            posix_tz_string = (
                tzif_fh.read().rstrip(b"\n").rpartition(b"\n")[-1].decode("ascii")
            )

            try:
                content = "`%s`" % posix_tz_string_to_tasmota_command(posix_tz_string)
            except OffsetOutOfRangeError:
                content = (
                    "This timezone has a UTC offset outside the range Tasmota supports."
                )
            except DstRuleNotSupportedError:
                content = "This timezone uses a DST start/end rule that Tasmota does not support."
            except DstStartEndTimeNotWholeHourError:
                content = "This timezone starts or ends DST part way through the hour, which Tasmota does not support."

            doc_fh.write(f"|{tz_key}|{content}|\n")

    doc_fh.write(
        f"\nThis table was generated from the [IANA Time Zone Database](https://www.iana.org/time-zones), version `{tzdata.IANA_VERSION}`."
    )
