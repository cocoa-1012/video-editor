import { useState } from "react";
import { MdFullscreen, MdFullscreenExit, MdFormatSize, MdOutlineSlowMotionVideo, MdHighQuality, MdOutlineArrowBackIos, MdOutlineArrowForwardIos, MdPlayArrow, MdPause, MdReplay, MdSettings, MdCheck, MdSkipNext, MdSkipPrevious, MdDownload, MdVolumeUp, MdVolumeOff } from 'react-icons/md';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import Slider from '@mui/material/Slider';
import PlayerSlider from '../Slider/Slider.js';
import FormattedTime from '../FormattedTime/FormattedTime.js';
import './control.scss';
import * as types from '../../../constants';

const playbacks = types.PLAYBACKS;
const fontpercents = types.FONT_PERCENTS;

const ItemHeader = ({ header, handleBack }) => {
	return (
		<DropdownItem onClick={handleBack}>
			<MdOutlineArrowBackIos className='player-control__speed-item-checker' />
			<span className='player-control__speed-item'>
				{header}
			</span>
		</DropdownItem>
	)
}

const Control = ({
	userLang,
	videoPlayerControlRef,
	className,
	is_playing,
	is_muted,
	onMuteToggle,
	sliderInputRef,
	currentTimeRef,
	playbackRate,
	duration,
	fullscreen,

	resolution,
	resolutions,
	onResolution,

	fontpercent,
	onFontpercent,

	onSliderMouseUp,
	onSliderMouseDown,
	onSliderChange,
	onRewind,
	onPlayPause,
	onPlaybackRateChange,
	onSkipPrevious,
	onSkipNext,
	volume,
	onVolumeChange,
	onDownloadNotes,
	onExportToMP4,
	onEndExportToMP4,
	playerw,
	playerh,
	controlVisibility,
	browserSupportsMP4,
	isRecording,
	onFullscreen,
	videoduration,
}) => {
	const [btnRewindDisabled, setBtnRewindDisabled] = useState(false);
	const [btnDisabled, setBtnDisabled] = useState(false);
	const [settingsopen, setSettingsopen] = useState(false);

	const [playrateopen, setPlayrateopen] = useState(false);
	const [fontpercentopen, setFontpercentopen] = useState(false);
	const [resolutionopen, setResolutionopen] = useState(false);

	function handleBack() {
		setSettingsopen(true)
		setPlayrateopen(false)
		setResolutionopen(false)
		setFontpercentopen(false)
	}
	function showPlaybackRate() {
		setPlayrateopen(true)
	}
	function showResolution() {
		setResolutionopen(true)
	}

	function showFontpercent() {
		setFontpercentopen(true)
	}

	function handleSettingsOpen() {
		setSettingsopen(!settingsopen)
	}

	function handlePlayrateOpen() {
		setPlayrateopen(!playrateopen)
	}
	function handleFontpercentOpen() {
		setFontpercentopen(!fontpercentopen)
	}
	function handleResolutionopen() {
		setResolutionopen(!resolutionopen)
	}

	let control_height = types.DIMENSIONS.H3 * playerh / types.DIMENSIONS.ORIGINALHEIGHT - 24;
	if (control_height > types.DIMENSIONS.MAX_CONTROL_HEIGHT)
		control_height = types.DIMENSIONS.MAX_CONTROL_HEIGHT
	let volume_padding = 13;
	if (control_height < types.DIMENSIONS.MAX_CONTROL_HEIGHT)
		volume_padding = control_height / 3;
	return (
		<div
			ref={videoPlayerControlRef}
			className={`player-control${className ? ` ${className}` : ''}`} style={{
				opacity: controlVisibility === 'hidden' ? 0 : 1,
			}} >
			<PlayerSlider
				sliderInputRef={sliderInputRef}
				onMouseUp={onSliderMouseUp}
				onMouseDown={onSliderMouseDown}
				onChange={onSliderChange}
				playerw={playerw}
				videoduration={videoduration}
			/>
			<div className='d-flex' style={{
				marginLeft: `${(types.DIMENSIONS.W1) * playerw / types.DIMENSIONS.ORIGINALWIDTH}px`,
				width: `${playerw - (types.DIMENSIONS.W1 * 2) * playerw / types.DIMENSIONS.ORIGINALWIDTH}px`,
				height: `${control_height}px`,
				background: fullscreen ? 'gray' : '',
				justifyContent: 'space-between'
			}}>
				<div className='d-flex' style={{ height: `${control_height}px` }} >
					<button disabled={btnRewindDisabled} title={types.labels[userLang].Rewind} className='player-control__button d-flex align-items-center' onClick={() => {
						setBtnRewindDisabled(true);
						const to = setTimeout(() => { setBtnRewindDisabled(false); clearTimeout(to); }, 10000);
						onRewind()
					}} style={{ height: `${control_height}px` }}>
						<MdReplay className='player-control__icon' style={{
							width: `${control_height}px`,
							height: `${control_height}px`
						}} />
					</button>

					<button disabled={btnDisabled} title={types.labels[userLang].Previous} className='player-control__button d-flex align-items-center' onClick={() => {
						setBtnDisabled(true);
						const to = setTimeout(() => { setBtnDisabled(false); clearTimeout(to); }, 300)
						onSkipPrevious()
					}} style={{ height: `${control_height}px` }}>
						<MdSkipPrevious className='player-control__icon' style={{
							width: `${control_height}px`,
							height: `${control_height}px`
						}} />
					</button>
					<button title={is_playing ? types.labels[userLang].Pause : types.labels[userLang].Play} className='player-control__button d-flex align-items-center' onClick={onPlayPause} style={{ height: `${control_height}px` }}>
						{is_playing ? <MdPause className='player-control__icon' style={{
							width: `${control_height}px`,
							height: `${control_height}px`
						}} /> : <MdPlayArrow className='player-control__icon' style={{
							width: `${control_height}px`,
							height: `${control_height}px`
						}} />}
					</button>
					<button disabled={btnDisabled} title={types.labels[userLang].Next} className='player-control__button d-flex align-items-center' onClick={() => {
						setBtnDisabled(true);
						const to = setTimeout(() => { setBtnDisabled(false); clearTimeout(to); }, 300)
						onSkipNext()
					}} style={{ height: `${control_height}px` }}>
						<MdSkipNext className='player-control__icon' style={{
							width: `${control_height}px`,
							height: `${control_height}px`
						}} />
					</button>
					<div>
						<button className='player-control__button player-control__timebutton d-flex align-items-center' style={{ height: `${control_height}px` }} >
							<div className='player-control__time'>
								<time ref={currentTimeRef}>00:00:00</time>
								<span className='player-control__alltime'>
									{' / '}
									<FormattedTime seconds={duration} />
								</span>
							</div>
						</button>
					</div>
					<div className='d-flex'>
						<button className='player-control__button d-flex align-items-center' onClick={onMuteToggle} style={{ height: `${control_height}px` }}>
							{is_muted ? <MdVolumeOff className='player-control__icon' style={{
								width: `${control_height}px`,
								height: `${control_height}px`
							}} /> : <MdVolumeUp className='player-control__icon' style={{
								width: `${control_height}px`,
								height: `${control_height}px`
							}} />}
						</button>

						<Slider id='volumeDiv'
							style={{ marginLeft: '15px', padding: `${volume_padding}px 0` }}
							value={volume}
							onChange={onVolumeChange}
							aria-labelledby="input-slider"
						/>
					</div>
				</div>
				<div className='d-flex' >
					<div className='player-control__settings_div' id='player_settings'>
						<Dropdown title={types.labels[userLang].Settings} direction="up" isOpen={settingsopen} toggle={handleSettingsOpen}>
							<DropdownToggle tag="span">
								<button className='player-control__button d-flex' >
									<MdSettings className='player-control__settings' style={{
										width: `${control_height}px`,
										height: `${control_height}px`
									}} />
								</button>
							</DropdownToggle>
							<DropdownMenu>
								<DropdownItem onClick={() => showPlaybackRate()}>
									<MdOutlineSlowMotionVideo className='player-control__speed-item-checker' />
									<span className='player-control__speed-item'>
										{types.labels[userLang].PlaybackSpeed}
									</span>
									<span className='player-control__speed-item-right'>
										{playbackRate === 1 ? types.labels[userLang].Normal : `${playbackRate}x`}
										<MdOutlineArrowForwardIos style={{ marginLeft: '10px' }} />
									</span>
								</DropdownItem>
								<DropdownItem onClick={() => showResolution()}>
									<MdHighQuality className='player-control__speed-item-checker' />
									<span className='player-control__speed-item'>
										{types.labels[userLang].Quality}
									</span>
									<span className='player-control__speed-item-right'>
										{resolution === 720 ? types.labels[userLang].NormalHD : `${resolution}p`}
										<MdOutlineArrowForwardIos style={{ marginLeft: '10px' }} />
									</span>
								</DropdownItem>

								<DropdownItem onClick={() => showFontpercent()}>
									<MdFormatSize className='player-control__speed-item-checker' />
									<span className='player-control__speed-item'>
										{types.labels[userLang].Fontsize}
									</span>
									<span className='player-control__speed-item-right'>
										{fontpercent === 100 ? types.labels[userLang].Normal : `${fontpercent}%`}
										<MdOutlineArrowForwardIos style={{ marginLeft: '10px' }} />
									</span>
								</DropdownItem>
							</DropdownMenu>
						</Dropdown>
					</div>


					<div className='player-control__settings_div' style={{ width: 0 }}>
						<Dropdown title={types.labels[userLang].Playrate} direction="up" isOpen={playrateopen} toggle={handlePlayrateOpen} style={{ height: `${control_height}px` }}>
							<DropdownToggle tag="span" style={{ height: `${control_height}px` }}>
							</DropdownToggle>
							<DropdownMenu>
								<ItemHeader header='Playback speed' handleBack={handleBack} />

								<DropdownItem divider />
								{playbacks.map((item, index) => (
									<DropdownItem key={index} onClick={() => onPlaybackRateChange(item)}>
										{playbackRate === item ? (<MdCheck className='player-control__speed-item-checker' />) : ''}
										<span className='player-control__speed-item'>
											{item === 1 ? types.labels[userLang].Normal : `${item}x`}
										</span>
									</DropdownItem>
								))}
							</DropdownMenu>
						</Dropdown>
					</div>

					<div className='player-control__settings_div' style={{ width: 0 }}>
						<Dropdown title={types.labels[userLang].Quality} direction="up" isOpen={resolutionopen} toggle={handleResolutionopen} style={{ height: `${control_height}px` }}>
							<DropdownToggle tag="span" style={{ height: `${control_height}px` }}>
							</DropdownToggle>
							<DropdownMenu>
								<ItemHeader header={types.labels[userLang].Quality} handleBack={handleBack} />
								<DropdownItem divider />
								{resolutions.map((item, index) => (
									<DropdownItem key={index} onClick={() => onResolution(item)}>
										{resolution === item ? (<MdCheck className='player-control__speed-item-checker' />) : ''}
										<span className='player-control__speed-item'>{item === 720 ? types.labels[userLang].NormalHD : `${item}p`}</span>
									</DropdownItem>
								))}
							</DropdownMenu>
						</Dropdown>
					</div>

					<div className='player-control__settings_div' style={{ width: 0 }}>
						<Dropdown title={types.labels.fontsize} direction="up" isOpen={fontpercentopen} toggle={handleFontpercentOpen} style={{ height: `${control_height}px` }}>
							<DropdownToggle tag="span" style={{ height: `${control_height}px` }}>
							</DropdownToggle>
							<DropdownMenu>
								<ItemHeader header='Font size' handleBack={handleBack} />
								<DropdownItem divider />
								{fontpercents.map((item, index) => (
									<DropdownItem key={index} onClick={() => onFontpercent(item)}>
										{fontpercent === item ? (<MdCheck className='player-control__speed-item-checker' />) : ''}
										<span className='player-control__speed-item'>{item === 100 ? types.labels[userLang].Normal : `${item}%`}</span>
									</DropdownItem>
								))}

							</DropdownMenu>
						</Dropdown>
					</div>
					<div>
						<button title={types.labels[userLang].Fullscreen} className='player-control__button d-flex align-items-center' onClick={onFullscreen} style={{ height: `${control_height}px` }}>
							{
								document.fullscreenElement !== null &&
								<MdFullscreenExit className='player-control__icon' style={{
									width: `${control_height}px`,
									height: `${control_height}px`
								}} />
							}
							{
								document.fullscreenElement === null &&
								<MdFullscreen className='player-control__icon' style={{
									width: `${control_height}px`,
									height: `${control_height}px`
								}} />
							}
						</button>
					</div>
					<div>
						<button title={types.labels[userLang].Downloadnotes} className='player-control__button d-flex align-items-center' onClick={onDownloadNotes} style={{ height: `${control_height}px` }}>
							<MdDownload className='player-control__icon' style={{
								width: `${control_height}px`,
								height: `${control_height}px`
							}} />
						</button>
					</div>
					{
						browserSupportsMP4 &&
						(!isRecording && (<div>
							<button title={types.labels[userLang].ExportToMP4} className='player-control__button d-flex align-items-center' onClick={onExportToMP4} style={{ height: `${control_height}px` }}>
								<MdDownload className='player-control__icon' style={{
									width: `${control_height}px`,
									height: `${control_height}px`
								}} />
							</button>
						</div>)
						)
					}
					{
						browserSupportsMP4 &&
						(isRecording && (<div>
							<button title={types.labels[userLang].ExportToMP4} className='player-control__button d-flex align-items-center' onClick={onEndExportToMP4} style={{ height: `${control_height}px` }}>
								<MdCheck className='player-control__icon' style={{
									width: `${control_height}px`,
									height: `${control_height}px`
								}} />
							</button>
						</div>)
						)
					}
				</div>
			</div>
		</div >
	);
};

export default Control;