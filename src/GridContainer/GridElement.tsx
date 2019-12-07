import * as React from 'react';
import { GridUtils } from "./GridUtils";
import { GridContainer } from "./GridContainer";
import { styleGridCell, styleGridCellPanel, styleComponentSelector, styleSplit, styleJoin, styleSwap, styleOverlay } from "./style";
import { GridContext } from './GridContext';
import { GridPanel } from './GridPanel';

type JoinStatus = "none" | "merge" | "expand";

interface GridElementProps {
	element: IGridFrame.gridElement;
	component: IGridFrame.gridComponent | undefined;
}

interface GridElementState {
	
}

export class GridElement extends React.Component<GridElementProps, GridElementState> {

	public static contextType = GridContext;

	public context: IGridFrame.ContextProps;

	public static readonly SUBGRID_ID = "__subgrid";
	public static readonly DND_DATATRANSFER_TYPE = "gridframednd";

	//TODO: its not a constan. rename to snake case.
	private static PREVENT_DND_PROPAGATION: boolean = false;

	/*private static defaultProps: Partial<GridElementProps> = {
		config: {
			customStyling: false
		}
	};*/

	public constructor(props: GridElementProps) {
		super(props);

		//const selectedComponent = props.element.componentId ? props.element.componentId : "";
		//const component = this.context.components ? this.context.components[selectedComponent] : undefined;

		this.state = {
			//selectedComponent,
			//component
		};
	}

	/**
	 * Resets currentContainer and currentElement if one of them was unset
	 * TODO: that is extra load and probably not the best solution,
	 * but is used to overcom issue when mouse move from one grid element to another
	 * skiping the borders.
	 */
	private onGridContainerMove = (e: React.MouseEvent<HTMLElement>) => {
		const {currentContainer, currentElement} = this.context.getDndEvent();

		if(!currentContainer || !currentElement) {
			const currentTarget = e.currentTarget as HTMLElement;
			const elementId = Number(currentTarget.dataset.id);
			
			this.context.setDndEvent({
				currentContinerRect: currentTarget.getBoundingClientRect(),
				currentContainer: currentTarget
			});

			if( Number.isInteger(elementId) ) {
				this.context.setDndEvent({
					currentElement: this.context.gridElements.find( elem => elem.id === elementId )
				});
			}
		}
	}

	private onGridContainerEnter = (e: React.MouseEvent<HTMLElement>) => {
		const {type} = this.context.getDndEvent();
		if(type !== "inactive") return;

		const currentTarget = e.currentTarget as HTMLElement;
		const elementId = Number(currentTarget.dataset.id);
		
		this.context.setDndEvent({
			currentContinerRect: currentTarget.getBoundingClientRect(),
			currentContainer: currentTarget
		});

		if( Number.isInteger(elementId) ) {
			this.context.setDndEvent({
				currentElement: this.context.gridElements.find( elem => elem.id === elementId )
			});
		}
	}

	private onGridContainerLeave = (e: React.MouseEvent<HTMLElement>) => {
		const {currentContainer} = this.context.getDndEvent();
		if(!currentContainer) return;

		currentContainer.style.removeProperty("cursor");
	}

	private onContainerDrag = (e: React.DragEvent) => {
		const {type, currentElement, currentContainer} = this.context.getDndEvent();
		const {gridAreaId} = this.context.getWorkArea();
		const elementId = this.getHTMLId();
		const target = e.target as HTMLElement;
		
		//if the source of dnd is not this container
		if(!target.id || target.id !== elementId) {
			return;
		}

		if(type !== "swap") {
			if(this.props.element.componentId !== GridElement.SUBGRID_ID) {
				e.preventDefault();
			}

			return;
		} else if(currentElement) {
			const data: IGridFrame.dndTranserData = {
				gridId: gridAreaId,
				elementId: currentElement.id,
				componentId: currentElement.componentId
			};

			if(currentContainer) {
				currentContainer.classList.add("dnd_snapshot");
			}

			GridElement.PREVENT_DND_PROPAGATION = false;
			e.dataTransfer.setData(GridElement.DND_DATATRANSFER_TYPE, JSON.stringify(data));
		}
	}

	private onContainerDrop = (e: React.DragEvent) => {
		if(GridElement.PREVENT_DND_PROPAGATION) {
			this.context.clearDNDState();
			return;
		}

		const {currentElement} = this.context.getDndEvent();
		const dataTransfer = e.dataTransfer.getData(GridElement.DND_DATATRANSFER_TYPE);
		
		if(!dataTransfer) return;
		if(!currentElement) return;

		const data: IGridFrame.dndTranserData = JSON.parse(dataTransfer);
		if(!data || !data.gridId || !Number.isInteger(data.elementId)) return;

		const {gridAreaId} = this.context.getWorkArea();
		const currentTarget = e.currentTarget as HTMLElement;
		const targetId = Number(currentTarget.dataset.id);
		const gridElements = this.context.gridElements;

		GridElement.PREVENT_DND_PROPAGATION = true;
		
		if(data.gridId !== gridAreaId) {
			const originComponentId = this.props.element.componentId;
			const componentId = data.componentId ? data.componentId : false;
			this.context.changeComponentId(this.props.element.id, componentId);
			
			this.context.setElementComponent(data.gridId, data.elementId, originComponentId);
			this.context.clearDNDState();

			return;
		}

		gridElements.some( element => {
			if(element.id === targetId) {
				[element.column, currentElement.column] = [currentElement.column, element.column];
				[element.row, currentElement.row] = [currentElement.row, element.row];
				
				return true;
			}

			return false;
		});

		//drop event dont trigger mouse up event, so we need to trigger it manually
		this.context.clearDNDState();
		this.context.setFrameElements(gridElements);
	}

	private getCellStyle = (): React.CSSProperties => {
		const element = this.props.element;
		const {customStyling} = this.context.config;

		let cellStyle: React.CSSProperties = {};
		if(!customStyling) cellStyle = {...styleGridCell};

		cellStyle.gridColumnStart = element.column.start;
		cellStyle.gridColumnEnd = element.column.end;

		cellStyle.gridRowStart = element.row.start;
		cellStyle.gridRowEnd = element.row.end;

		cellStyle.overflow = "auto";
		if(this.props.component && this.props.component.overflowVisible) {
			cellStyle.overflow = "visible";
		}

		return cellStyle;
	}

	private getComponentContainer = (defaultComponent: IGridFrame.defaultComponent | false) => {
		const {element} = this.props;
		let componentContainer: IGridFrame.gridComponent | undefined;

		if(element.componentId) {
			if(this.context.components && this.context.components[element.componentId]) {
				componentContainer = this.context.components[element.componentId];
			}
		} else if(defaultComponent) {
			componentContainer = defaultComponent.container;
		}

		//TODO: I propbably dont need to send them via props, as I use context now. Need to rewrite it.
		if(componentContainer && componentContainer.gridProps) {
			if(componentContainer.gridProps.components) {
				componentContainer.props.gridComponents = this.context.components;
			}

			if(componentContainer.gridProps.elements) {
				componentContainer.props.gridElement = this.context.gridElements;
			}

			if(componentContainer.gridProps.template) {
				componentContainer.props.gridTemplate = this.context.gridTemplate;
			}
		}

		return componentContainer;
	}

	private getAdaptiveObserve = (
		defaultAdaptiveObserve: IGridFrame.adaptiveObserve,
		componentContainer: IGridFrame.gridComponent | undefined
		): IGridFrame.adaptiveObserve => {

		let adaptiveObserve: IGridFrame.adaptiveObserve = {};

		if(componentContainer && componentContainer.observe && componentContainer.observe.adaptive) {
			adaptiveObserve = componentContainer.observe.adaptive;
		} else if(defaultAdaptiveObserve) {
			adaptiveObserve = defaultAdaptiveObserve;
		}

		return adaptiveObserve;
	}

	private checkJoinStatus = () => {
		let status: JoinStatus = "none";

		const {currentElement} = this.context.getDndEvent();
		const {element} = this.props;
		const {joinDirection} = this.context;

		const targetOfJoining: boolean = GridUtils.isTargedOfJoining(element, currentElement, joinDirection);

		if(joinDirection !== "none" && targetOfJoining) {

			if(GridUtils.joinIsPossible(element, currentElement, joinDirection)) {
				this.context.setDndEvent({joinTargetElement: element});
				status = "merge";

			} else if(GridUtils.canJointSplit(element, currentElement, joinDirection)) {
				this.context.setDndEvent({joinTargetElement: element});
				status = "expand";
			}
		}

		return status;
	}

	private showOverlay = (props: {status: JoinStatus}): JSX.Element => {
		const {customStyling} = this.context.config;
		const {classPrefix} = this.context.getWorkArea();
		let className: string = `${classPrefix}cell_overlay`;

		const overlayStyle = customStyling ? {} : {...styleOverlay};

		if(customStyling) {
			className += " " + classPrefix + props.status;
		} else {
			if(props.status === "merge") {
				overlayStyle.backgroundColor = "red";
			}

			if(props.status === "expand") {
				overlayStyle.backgroundColor = "green";
			}
		}

		return <div style={overlayStyle} className={className} />;
	}

	private getHTMLId = (): string => {
		const {gridAreaId} = this.context.getWorkArea();
		const {element} = this.props;

		return `${gridAreaId}-container-${element.id}`;
	}

	private onDragOver = (e: React.MouseEvent) => {
		const {type, madeDNDSnapshot, currentContainer} = this.context.getDndEvent();
		e.preventDefault();

		if(type === "swap" && !madeDNDSnapshot && currentContainer) {
			currentContainer.classList.remove("dnd_snapshot");

			this.context.setDndEvent({
				madeDNDSnapshot: true
			});
		}
	}

	public render() {
		const {targetOfDraggable} = this.context.getDndEvent();
		const {defaultComponent, defaultAdaptiveObserve, classPrefix} = this.context.getWorkArea();
		const {element} = this.props;

		const cellStyle: React.CSSProperties = this.getCellStyle();
		const htmlId = this.getHTMLId();
		
		const componentContainer = this.getComponentContainer(defaultComponent);
		const adaptiveObserve = this.getAdaptiveObserve(defaultAdaptiveObserve, componentContainer);
		const joinStatus = this.checkJoinStatus();

		const addClass = targetOfDraggable && targetOfDraggable === element.id ? "dnd_drag" : "";

		return (
			<div
				style={cellStyle}
				key={"gridElement:" + element.id}
				data-id={element.id}
				className={classPrefix + "container " + addClass}
				id={htmlId}
				onMouseEnter={this.onGridContainerEnter}
				onMouseLeave={this.onGridContainerLeave}
				onMouseMove={this.onGridContainerMove}
				onDragStart={this.onContainerDrag}
				onDrop={this.onContainerDrop}
				onDragOver={this.onDragOver}
				draggable={true}
			>
				{joinStatus !== "none" &&
					<this.showOverlay status={joinStatus} />
				}

				{this.context.showPanel &&
					<GridPanel
						elementId={element.id}
						componentId={this.props.element.componentId || ""}
					/>
				}

				{componentContainer &&
					<GridContainer
						body={componentContainer.body}
						props={componentContainer.props}
						containerId={element.id}
						htmlContainerId={htmlId}
						changeComponentId={this.context.changeComponentId}
						adaptiveObserve={adaptiveObserve}
					/>
				}
			</div>
		);
	}
}
