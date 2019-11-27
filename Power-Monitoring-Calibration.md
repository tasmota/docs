!> You need to calibrate your power monitoring device as correct measurements are influenced by hardware and timing differences.

- Your power monitoring capable device flashed with Tasmota and configured with the correct module/template that supports power monitoring
- An AC capable **calibrated** multi-meter
- A **known** wattage load with a **power factor as close to 1** as possible (e.g., a resistive load) for best results  

> [!NOTE]
>  A resistive load device is any device which draws a constant amount of power. For example, an incandescent or halogen light bulb (best choice since their power draw is declared on them). An electric kettle, heater, or blow dryer are also options but you will also need a power meter since the power draw *could* vary.  

> [!DANGER]
>  Do not use switch mode driven devices such as LED lamps, computer equipment, or inductive/capacitive devices such as motors!

- *(optional)* A calibrated power meter (a.k.a Kill-a-Watt) or AC multi-meter

## Setup
- Connect the load (e.g., a 60W incandescent light bulb) to your device  
  - *(optional)* Plug your load into the Kill-a-Watt
- Open two Tasmota web UI browser windows for your power monitoring device:
  - Click on Console in one browser window
  - Keep the other on the main page to view the Power telemetry data
- Turn the power on to your device. Be sure to turn the output on so the load is powered on as well
- Wait a few seconds for the readings to stabilize

## Calibration Procedure
1. Verify the **Power** reading in the web UI (optionally with the power meter as well) for the expected wattage. Adjust the power offset if needed (in Watts):  
   [`PowerSet 60.0`](Commands#powerset)  
   _If you're using something other than a 60W bulb, enter your load's power rating_

2. Verify the **Voltage** reading. Adjust the voltage offset if needed (in Volts):  
   [`VoltageSet <voltage>`](Commands#voltageset)  
   _Replace `<voltage>` with your standard voltage or with reading on your multi-meter if you have one. Your voltage will vary depending on the electrical standards and your electrical grid_  

3. Verify the **Current** reading by calculating current value (amperage) using this formula: **P<sub>(W)</sub>/V<sub>(V)</sub>=I<sub>(A)</sub>**. Adjust the current offset if needed (in milliAmps (mA=A\*1000)):  
   [`CurrentSet <current>`](Commands#currentset)  
   _Replace `<current>` with your calculated value (in milliAmps)_  

   `CurrentSet` calculation:   
   P/V=I
   1000 * Watts/Volts = milliAmperes

> [!EXAMPLE]
> 1000*(60.0/235.5) = 254.777

4. Confirm the validity of your calibration process checking `Power Factor` from the web UI which should be as close as possible to `1.00`. In theory resistive loads will always provide a power factor of 1.00. If that is not the case, we recommend you repeat the calibration process and make sure everything was done correctly. 
   
## Fine Tuning
_This procedure requires the use of a calibrated power meter or AC multi-meter._   

Commands [`CurrentCal`](Commands#currentcal), [`PowerCal`](Commands#powercal) and [`VoltageCal`](Commands#voltagecal)  allow fine tuning of the power calibration.  

Repeat the procedure below for each of the readings: Current, Power, and Voltage using the corresponding calibration command ([`CurrentCal`](Commands#currentcal), [`PowerCal`](Commands#powercal), and [`VoltageCal`](Commands#voltagecal) respectively). **Take note that the offset ranges vary for each command**.  

1. Check the reading using a multi-meter
2. Compare it with the reading on the Tasmota web UI
3. If there is an observed difference, change the offset value by issuing the calibration command in the Console (e.g., `PowerCal 10000`)
4. Adjust the offset value up or down until the readings on the multi-meter and the web page are as close as possible

## Known Issues
Power monitoring chips like the HLW8032 (Blitzwolf SHP5) and CSE7766 (Sonoff S31, Sonoff POW R2) occasionally report invalid power measurements for load values below 5W. During this situation it sometimes reports a valid load. By setting [SetOption39](Commands#setoption39) to `128` (default) it must read at least 128 invalid power readings before reporting there is no load.

To discard all loads below 6W simply set `SetOption39 1` (`0` will reset to default on next restart) so it will report no load below 6W.
