Prism.languages.console = {
	'operator': /^\b(?:rule)\d?\b/im,
	'number': /\b(?<=on)\s\S{1,}#\S{1,}\b/i,
	'selector': /(?<!(power\w+))\s(?:on|do|endon|break|if|else|elseif|and|or)\b/i,
	'regex': /\b(?:backlog)\b/i,
	'comment': /[<]\w+[>]/,
	'deleted': /[;]\s/,
	'json': {
		pattern: /[{].*[}]/,
			alias: 'language-json',
			inside: Prism.languages.json
			},
	'important': /(?<!\ )^\w+/im,
};
