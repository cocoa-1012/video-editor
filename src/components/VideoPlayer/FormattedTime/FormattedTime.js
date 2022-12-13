const pad = (string, digits) => ('0'.repeat(digits - 1) + string).slice(-digits);

export const format = (seconds) => {
	const date = new Date(seconds * 1000);
	const hh = pad(date.getUTCHours(), 2);
	const mm = pad(date.getUTCMinutes(), 2);
	const ss = pad(date.getUTCSeconds(), 2);
	// const ms = pad(date.getUTCMilliseconds(), 3);

	return `${hh}:${mm}:${ss}`;
};

const FormattedTime = ({ className, seconds }) => (
	<time dateTime={`P${Math.round(seconds)}S`} className={className}>
		{format(seconds)}
	</time>
);

export default FormattedTime;
