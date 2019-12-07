import * as React from 'react';
import { GridContext } from './GridContext';
import {  styleGridCellPanel, styleComponentSelector, styleSplit, styleJoin, styleSwap } from "./style";

interface GridPanelProps {
	elementId: number;
	componentId: string;
}

interface GridPanelState {

}

export class GridPanel extends React.Component<GridPanelProps, GridPanelState> {

	public static contextType = GridContext;

	//@ts-ignore
	public context: IGridFrame.ContextProps;

	public constructor(props: GridPanelProps) {
		super(props);

		this.state = {
			
		};
	}

	public render() {
		const {customStyling} = this.context.config;
		const {classPrefix} = this.context.getWorkArea();

		const panelStyle: React.CSSProperties = customStyling ? {} : {...styleGridCellPanel};
		const selectorStyle: React.CSSProperties = customStyling ? {} : {...styleComponentSelector};
		const splitStyle: React.CSSProperties = customStyling ? {} : {...styleSplit};
		const joinStyle: React.CSSProperties = customStyling ? {} : {...styleJoin};
		const swapStyle: React.CSSProperties = customStyling ? {} : {...styleSwap};

		return (
			<div className={classPrefix + "controlPanel"} style={panelStyle}>
				<div style={splitStyle} data-grabber="true" className={classPrefix + "spliter"} onMouseDown={this.onGrabberStart} />

				<select
					className={classPrefix + "componentSelector"}
					style={selectorStyle}
					onChange={this.onChangeComponentId}
					data-id={this.props.elementId}
					value={this.props.componentId || ""}
				>
					{this.showOptions()}
				</select>

				<div style={swapStyle} data-grabber="true" className={classPrefix + "swapper"} onMouseDown={this.onSwapStart}/>
				<div style={joinStyle} data-grabber="true" className={classPrefix + "joiner"} onMouseDown={this.onJoinerStart}/>
			</div>
		);
	}

	private onGrabberStart = (e: React.MouseEvent<HTMLElement>) => {
		const {clientX, clientY, pageX, pageY} = e;

		this.context.setDndEvent({
			eventOriginPos: {clientX, clientY, pageX, pageY},
			type: "grabber"
		});

		this.context.setDnDActive(true);
	}

	private onJoinerStart = (e: React.MouseEvent<HTMLElement>) => {
		const {clientX, clientY, pageX, pageY} = e;

		this.context.setDndEvent({
			eventOriginPos: {clientX, clientY, pageX, pageY},
			type: "join"
		});

		this.context.setDnDActive(true);
	}

	private onSwapStart = (e: React.MouseEvent<HTMLElement>) => {
		this.context.setDndEvent({
			type: "swap",
			targetOfDraggable: this.props.elementId
		});

		this.context.setDnDActive(true);
	}

	private showOptions = (): JSX.Element[] => {
		const options: JSX.Element[] = [];

		options.push(
			<option key={"0"} />
		);

		for(const index in this.context.components) {
			const component = this.context.components[index];

			options.push(
				<option key={index} value={index}>{component.name ? component.name : index}</option>
			);
		}

		return options;
	}

	//TODO: remove this. need to use changeComponentId instead
	private onChangeComponentId = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const componentId = e.target.value;
		const elementId = Number(e.target.dataset.id);

		this.context.changeComponentId(elementId, componentId);
	}
}
