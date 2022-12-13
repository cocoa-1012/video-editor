import './slider.scss';
import * as types from '../../../constants';

const Slider = ({
	className,
	onMouseUp,
	onMouseDown,
	onChange,
	sliderInputRef,
	playerw,
	videoduration,
}) => {
	return (
		<div className={`player-slider ${className ? ` ${className}` : ''}`}
			style={{
				marginLeft: `${(types.DIMENSIONS.W1) * playerw / types.DIMENSIONS.ORIGINALWIDTH}px`,
				width: `${playerw - (types.DIMENSIONS.W1 * 2) * playerw / types.DIMENSIONS.ORIGINALWIDTH}px`,
			}}>
			<input
				ref={sliderInputRef}
				type='range'
				min={0}
				max={videoduration > 0 ? 1 : 0}
				step='any'
				onMouseUp={onMouseUp}
				onMouseDown={onMouseDown}
				onChange={onChange}
				onInput={onChange}
			/>
		</div>
	);
}

export default Slider;