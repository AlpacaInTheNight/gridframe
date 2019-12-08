import * as React from "react";
import { GridUtils } from "./GridContainer/GridUtils";
import { GridElement } from "./GridContainer/GridElement";
import { styleGridArea } from "./GridContainer/style";
import { GridContext } from './GridContainer/GridContext';
import GridEvents, { DNDEvent } from './events/grid';

import ResizeObserver from 'resize-observer-polyfill';

//import { bool, number, element } from "prop-types";
//import { DNDManager } from "./DNDManager";

export interface GridFrameUpdate {
	template: IGridFrame.gridTemplate;
	elements: IGridFrame.gridElement[];
}

interface GridFrameProps {
	gridId: string;
	template: IGridFrame.gridTemplate;
	elements: IGridFrame.gridElement[];
	components: IGridFrame.gridComponents;
	config: Partial<IGridFrame.gridConfig>;

	onGridUpdate?: (update: GridFrameUpdate) => void;
}

export interface GridFrameState {
	gridTemplate: IGridFrame.gridTemplate;
	gridElements: IGridFrame.gridElement[];

	dndActive: boolean;
	joinDirection: IGridFrame.cellActionDirection;

	showPanel: boolean;
}

export default class GridFrame extends React.Component<Partial<GridFrameProps>, GridFrameState> {

	/**
	 * Default grid cell size in fr units
	 */
	private static readonly GRID_FR_SIZE = 1000;
	private static readonly GRID_MIN_SIZE = GridFrame.GRID_FR_SIZE * .025;

	//private static readonly DND_TRIGGER_DISTANCE = 40;
	private static readonly RESIZE_TRIGGER_DISTANCE = 30;
	private static readonly DEFAULT_GRID_ID_PREFIX = "grid-";

	private static defaultProps: GridFrameProps = {
		gridId: "main",
		template: {columns: [1000], rows: [1000]},
		elements: [{
			column: {start: 1, end: 2},
			row: {start: 1,	end: 2},
			componentId: false,
			id: 0,
			props: {},
		}],
		components: {},
		config: {
			customStyling: false,
			allowSubGrid: false,
			hidePanel: false,
			lockGrid: false
		}
	};

	/**
	 * Array of the used ids. Used to make sure that no grid areas with the same ids would be created.
	 */
	private static USED_IDS: string[] = [];

	private static EXEMPLARS: {id: string, exemplar: GridFrame}[] = [];

	private gridFrameContext: IGridFrame.ContextProps;

	private events: GridEvents;

	private workArea: IGridFrame.workArea = {
		gridAreaId: "",
		gridAreaClassName: "",
		classPrefix: "",
		gridHTMLElements: undefined,
		gridHTMLContainer: undefined,
		defaultComponent: false,
		defaultAdaptiveObserve: {},
		gridIdPrefix: GridFrame.DEFAULT_GRID_ID_PREFIX,
		flexFactor: {
			col: 1,
			row: 1
		},
		allowGridResize: true,
	};

	public constructor(props: GridFrameProps) {
		super(props);

		this.events = new GridEvents();

		for(const componentId in props.components) {
			if(props.components[componentId].default) {
				this.workArea.defaultComponent = {
					id: componentId,
					container: props.components[componentId]
				};
				break;
			}
		}

		if(props.config) {
			if(props.config.idPrefix) {
				this.workArea.gridIdPrefix = props.config.idPrefix;
			}

			if(props.config.classPrefix) {
				this.workArea.classPrefix = props.config.classPrefix;
			}

			if(props.config.componentsDefaults && props.config.componentsDefaults.observe && props.config.componentsDefaults.observe.adaptive) {
				this.workArea.defaultAdaptiveObserve = props.config.componentsDefaults.observe.adaptive;
			}

			if(props.config.lockGrid) {
				this.workArea.allowGridResize = false;
			}
		}

		if(this.props.config && this.props.config.gridAreaClassName) {
			this.workArea.gridAreaClassName = this.props.config.gridAreaClassName;
		} else {
			this.workArea.gridAreaClassName = this.workArea.classPrefix + "gridArea";
		}

		this.workArea.gridAreaId = this.processGridId(this.props.gridId, this.workArea.gridIdPrefix);

		GridFrame.EXEMPLARS.push({
			id: this.workArea.gridAreaId,
			exemplar: this
		});

		this.state = {
			gridTemplate: props.template,
			gridElements: props.elements,
			dndActive: false,
			joinDirection: "none",
			showPanel: props.config && props.config.hidePanel ? false : true,
		};

		this.setContext();
	}

	public static getFrameTemplate = (frameId: string) => {
		const targetExemplar = GridFrame.EXEMPLARS.find(exemplar => exemplar.id === frameId);

		if(targetExemplar) {
			return targetExemplar.exemplar.state.gridTemplate;
		}

		return false;
	}

	public static getFrameElements = (frameId: string) => {
		const targetExemplar = GridFrame.EXEMPLARS.find(exemplar => exemplar.id === frameId);

		if(targetExemplar) {
			return targetExemplar.exemplar.state.gridElements;
		}

		return false;
	}

	private static setElementComponent = (areaId: string, elementId: number, componentId: string | false) => {
		GridFrame.EXEMPLARS.some(exemplar => {
			if(exemplar.id === areaId) {
				const gridAreaExemplar = exemplar.exemplar;
				const elements = gridAreaExemplar.state.gridElements;

				elements.some( elem => {
					if(elem.id === elementId) {
						elem.componentId = componentId;

						return true;
					}

					return false;
				});

				gridAreaExemplar.setState({gridElements: elements});
				return true;
			}

			return false;
		});
	}

	/**
	 * in pixels
	 */
	/*private containersActualSizes: {
		columns: number[];
		rows: number[];
		flexFactor: {
			col: number;
			row: number;
		}
	} = {
		columns: [],
		rows: [],
		flexFactor: {
			col: 1,
			row: 1
		}
	};*/

	public render() {
		this.setContext();

		const gridContainerStyle: React.CSSProperties = this.getGridAreaStyle();
		let className = this.workArea.gridAreaClassName;
		if(this.props.config && this.props.config.isSubGrid) {
			className += " " + this.workArea.classPrefix + "frame_subgrid";
		}

		return (
			<GridContext.Provider value={this.gridFrameContext}>
				<div
					id={this.workArea.gridAreaId}
					className={className}
					style={gridContainerStyle}
					onMouseDown={this.onGridMouseDown}
					onMouseUp={this.onGridMouseUp}
					onMouseMove={this.onGridMouseMove}
				>
					{this.renderGrid()}
				</div>
			</GridContext.Provider>
		);
	}

	//TODO: remove this and add updation for the new props
	public UNSAFE_componentWillUpdate(newProps: GridFrameProps, newState: GridFrameState) {
		//console.log("Updating GridFrame");
	}

	public componentDidMount() {
		const {gridAreaId} = this.workArea;
		this.workArea.gridHTMLContainer = document.getElementById(gridAreaId) || undefined;
		this.setContainersActualSizes();

		this.updateGridElementsList();

		const ro = new ResizeObserver((entries, observer) => {
			this.checkContainersBreakpoints();
		});

		this.workArea.gridHTMLContainer && ro.observe(this.workArea.gridHTMLContainer);

		document.addEventListener("keyup", this.onKeyUp);
	}

	public componentDidUpdate() {
		this.updateGridElementsList();
	}

	public componentWillUnmount() {
		document.removeEventListener("keyup", this.onKeyUp);

		GridFrame.USED_IDS = GridFrame.USED_IDS.filter(id => id !== this.workArea.gridAreaId);

		//TODO: check that it is deleted correctly
		GridFrame.EXEMPLARS = GridFrame.EXEMPLARS.filter(instance => instance.id !== this.workArea.gridAreaId);
	}

	private setContext = () => {
		this.gridFrameContext = {
			gridElements: this.state.gridElements,
			gridTemplate: this.state.gridTemplate,
			components: this.props.components,
			joinDirection: this.state.joinDirection,
			showPanel: this.state.showPanel,
			config: this.props.config as Partial<IGridFrame.gridConfig>,

			clearDNDState: this.clearDNDState,
			setElementComponent: GridFrame.setElementComponent,
			getDndEvent: this.getDndEvent,
			setDndEvent: this.setDndEvent,
			getWorkArea: this.getWorkArea,
			setWorkArea: this.setWorkArea,
			setDnDActive: this.setDnDActive,
			setFrameElements: this.setFrameElements,
			changeComponentId: this.changeComponentId
		};
	}

	private setFrameElements = (newElements: IGridFrame.gridElement[]) => {
		this.setState({gridElements: newElements});
		this.onUpdateGrid();
	}

	private processGridId = (id: string | undefined, idPrefix: string | undefined): string => {
		if(!id) id = GridFrame.defaultProps.gridId;
		if(idPrefix) id = idPrefix + id;
		const MAX_CYCLE = 100;
		let cycle = 0;

		function getValidGridId(proposedId: string): string {
			if(++cycle >= MAX_CYCLE) return proposedId;

			if(GridFrame.USED_IDS.includes(proposedId)) {
				const matches = proposedId.match(/\d+$/);
	
				if(matches) {
					proposedId = proposedId.replace(/\d+$/, "");
					proposedId += Number(matches[0]) + 1;
				} else {
					proposedId += "2";
				}

				return getValidGridId(proposedId);
			}

			return proposedId;
		}

		id = getValidGridId(id);

		GridFrame.USED_IDS.push(id);

		return id;
	}

	private setDnDActive = (newStatus: boolean) => {
		this.setState({dndActive: newStatus});
	}

	private getDndEvent = () => {
		return this.events.dndEvent;
	}

	private setDndEvent = (newDnDEvent: Partial<DNDEvent>) => {

		for(const item in newDnDEvent) {
			if(this.events.dndEvent.hasOwnProperty(item)) this.events.dndEvent[item] = newDnDEvent[item];
		}
	}

	private getWorkArea = () => {
		return this.workArea;
	}

	private setWorkArea = (newWorkArea: Partial<IGridFrame.workArea>) => {

		for(const item in newWorkArea) {
			if(this.workArea.hasOwnProperty(item)) this.workArea[item] = newWorkArea[item];
		}

		//this.workArea = newWorkArea;
	}

	private changeComponentId = (elementId: number, componentId: string | false) => {
		const gridElements = this.state.gridElements;

		gridElements.some(element => {
			if(element.id === elementId) {
				element.componentId = componentId;
				return true;
			}

			return false;
		});

		this.setFrameElements(gridElements);
	}

	private renderGrid = () => {
		const elements: JSX.Element[] = [];
		this.events.dndEvent.joinTargetElement = undefined;
		const components = this.props.components ? {...this.props.components} : {};

		if(this.props.config && this.props.config.allowSubGrid && !components[GridElement.SUBGRID_ID]) {
			const props: Partial<GridFrameProps> = {
				gridId: this.workArea.gridAreaId,
				config: {
					idPrefix: "sub",
					customStyling: this.props.config.customStyling,
					allowSubGrid: true,
					isSubGrid: true,
					hidePanel: this.props.config.hidePanel,
					lockGrid: this.props.config.lockGrid
				},
				components: this.props.components,
				template: {columns: [1000], rows: [1000]},
				elements: [{
					column: {start: 1, end: 2},
					row: {start: 1,	end: 2},
					componentId: false,
					id: 0,
					props: {},
				}]
			};

			components[GridElement.SUBGRID_ID] = {
				body: GridFrame,
				props,
				name: "Sub Grid"
			};
		}

		for(const element of this.state.gridElements) {
			let component: IGridFrame.gridComponent | undefined = undefined;
			if(element.componentId && this.props.components) {
				component = this.props.components[element.componentId];
			} else if(this.workArea.defaultComponent) {
				component = this.workArea.defaultComponent.container;
			}
			
			//move this methods to contex api
			elements.push(
				<GridElement
					key={`${this.workArea.gridIdPrefix}cell-${element.id}`}
					element={element}
					component={component}
				/>
			);
		}

		return elements;
	}

	/**
	 * Sends grid state to hosting component on its change.
	 */
	private onUpdateGrid = () => {
		const {onGridUpdate} = this.props;
		const {gridElements, gridTemplate} = this.state;

		onGridUpdate && onGridUpdate({
			template: gridTemplate,
			elements: gridElements
		});
	}

	private onGridMouseUp = (e: React.MouseEvent) => {
		if(this.events.dndEvent.type === "inactive") return;
		const {joinDirection, gridElements, gridTemplate} = this.state;
		const newGridState = this.events.onUpdateGrid({joinDirection, gridElements, gridTemplate});

		this.onUpdateGrid();
		this.clearDNDState(newGridState);
	}

	private clearDNDState = (newState?: Partial<GridFrameState> | false) => {
		if(!newState) newState = {};

		this.events.dndEvent.lineHorizontal = false;
		this.events.dndEvent.lineVertical = false;

		this.events.dndEvent.joinTargetElement = undefined;
		this.events.dndEvent.targetOfDraggable = undefined;
		this.events.dndEvent.madeDNDSnapshot = false;

		this.events.dndEvent.type = "inactive";

		if(this.state.dndActive) newState.dndActive = false;
		if(this.state.joinDirection !== "none") newState.joinDirection = "none";

		this.setState(newState as GridFrameState, () => {
			if(this.events.dndEvent.currentContainer) {
				this.events.dndEvent.currentContainerRect = this.events.dndEvent.currentContainer.getBoundingClientRect();
			}
		});
	}

	private checkContainersBreakpoints = () => {
		this.workArea.gridHTMLElements && this.workArea.gridHTMLElements.forEach( (container: HTMLElement) => {
			if(container.offsetWidth <= 210) {
				if(!container.classList.contains("slim")) {
					container.classList.add("slim");
				}
			} else if(container.classList.contains("slim")) {
				container.classList.remove("slim");
			}

			container.dataset.width = container.offsetWidth.toString();
			container.dataset.height = container.offsetHeight.toString();
		});
	}

	//TODO: rewrite this. I not sure it is needed at current state.
	private setContainersActualSizes = () => {
		const container = this.workArea.gridHTMLContainer;
		if(!container) return;

		const flexFactorHorizontal = this.state.gridTemplate.columns.reduce((a, b) => a + b, 0) / container.offsetWidth;
		const flexFactorVertical = this.state.gridTemplate.rows.reduce((a, b) => a + b, 0) / container.offsetHeight;

		this.workArea.flexFactor = {
			col: flexFactorHorizontal,
			row: flexFactorVertical
		};
	}

	private onGridMouseDown = (e: React.MouseEvent<HTMLElement>) => {
		if(!this.workArea.allowGridResize) return;

		if(this.events.dndEvent.lineHorizontal !== false || this.events.dndEvent.lineVertical !== false) {

			const {clientX, clientY, pageX, pageY} = e;

			this.events.dndEvent.eventOriginPos = {
				clientX, clientY, pageX, pageY
			};

			this.events.dndEvent.type = "resize";

			this.setContainersActualSizes();
			this.events.dndEvent.columnsClone = this.state.gridTemplate.columns.slice();
			this.events.dndEvent.rowsClone = this.state.gridTemplate.rows.slice();

			this.setState({dndActive: true});
		}
	}

	private onCellSplit = (direction: IGridFrame.splitDirection) => {
		if(!direction.isSplit || !this.events.dndEvent.currentElement) return;
		const {gridTemplate, gridElements} = this.events.onCellSplit({
			direction,
			gridTemplate: this.state.gridTemplate,
			gridElements: this.state.gridElements
		});

		this.setState({dndActive: false, gridTemplate, gridElements});
	}

	private setCellJoinDirection = (movedVertical: number, movedHorizontal: number) => {
		let direction: "left" | "right" | "top" | "bottom" | "none" = "none";

		if( Math.abs(movedVertical) > Math.abs(movedHorizontal) ) {
			direction = movedVertical > 0 ? "top" : "bottom";
		} else {
			direction = movedHorizontal > 0 ? "left" : "right";
		}

		if(this.state.joinDirection !== direction) {
			this.setState({joinDirection: direction});
		}
	}

	private onCellResize = (clientX: number, clientY: number) => {
		if(!this.workArea.gridHTMLContainer) return;
		const {col: colFactor, row: rowFactor} = this.workArea.flexFactor;

		function updateSize(cells: number[], cellsOrigin: number[], moved: number, lineNumber: number) {
			let gridTemplate = "";

			const indexA = lineNumber;
			const indexB = lineNumber + 1;

			const newValueA = +(cellsOrigin[indexA] + moved).toFixed(3);
			const newValueB = +(cellsOrigin[indexB] - moved).toFixed(3);

			if(newValueA > GridFrame.GRID_MIN_SIZE && newValueB > GridFrame.GRID_MIN_SIZE) {
				cells[indexA] = +(cellsOrigin[indexA] + moved).toFixed(3);
				cells[indexB] = +(cellsOrigin[indexB] - moved).toFixed(3);
			}

			for(const cell of cells) {
				gridTemplate += cell + "fr ";
			}

			return gridTemplate;
		}

		if(this.events.dndEvent.lineHorizontal !== false) {
			const movedX = (clientX - this.events.dndEvent.eventOriginPos.clientX) * colFactor;

			this.workArea.gridHTMLContainer.style.gridTemplateColumns = updateSize(
				this.events.dndEvent.columnsClone,
				this.state.gridTemplate.columns,
				movedX,
				this.events.dndEvent.lineHorizontal
			);
		}

		if(this.events.dndEvent.lineVertical !== false) {
			const movedY = (clientY - this.events.dndEvent.eventOriginPos.clientY) * rowFactor;

			this.workArea.gridHTMLContainer.style.gridTemplateRows = updateSize(
				this.events.dndEvent.rowsClone,
				this.state.gridTemplate.rows,
				movedY,
				this.events.dndEvent.lineVertical
			);
		}

		this.checkContainersBreakpoints();
	}

	private onDNDActiveMove = (e: React.MouseEvent<HTMLElement>) => {
		const {pageX, pageY, clientX, clientY} = e;

		if(this.events.dndEvent.type === "grabber") {
			const direction = GridUtils.checkSplitDirection(pageX, pageY, this.events.dndEvent.eventOriginPos);

			this.onCellSplit(direction);
		}

		if(this.events.dndEvent.type === "join") {
			const movedVertical = this.events.dndEvent.eventOriginPos.clientY - clientY;
			const movedHorizontal = this.events.dndEvent.eventOriginPos.clientX - clientX;
			
			this.setCellJoinDirection(movedVertical, movedHorizontal);
		}

		if(this.events.dndEvent.type === "resize") {
			this.onCellResize(clientX, clientY);
		}
		
	}

	private onGridMouseMove = (e: React.MouseEvent<HTMLElement>) => {

		if(this.state.dndActive) {
			this.onDNDActiveMove(e);
		} else {
			if(!this.events.dndEvent.currentContainerRect || !this.events.dndEvent.currentContainer || !this.events.dndEvent.currentElement) return;
			if(!this.workArea.allowGridResize) return;

			if( (e.target as HTMLElement).dataset.grabber ) {
				this.events.dndEvent.currentContainer.style.removeProperty("cursor");
				this.events.dndEvent.lineHorizontal = false;
				this.events.dndEvent.lineVertical = false;
				return;
			}

			const {clientX, clientY} = e;
			const {gridTemplate} = this.state;
			this.events.onGridMouseMove({clientX, clientY, gridTemplate});
		}

	}

	//TODO: make keybinding configurable
	private onKeyUp = (e: KeyboardEvent) => {
		if(e.keyCode === 73 && e.ctrlKey === true ) {
			this.setState({
				showPanel: !this.state.showPanel
			});
		}

		if(e.keyCode === 81 && e.ctrlKey === true ) {
			this.workArea.allowGridResize = !this.workArea.allowGridResize;
		}
	}

	private updateGridElementsList = () => {
		const {gridAreaId, classPrefix} = this.workArea;
		if(this.workArea.gridHTMLContainer) {
			const selector = `#${gridAreaId} > .${classPrefix}container`;
			this.workArea.gridHTMLElements = document.querySelectorAll(selector);

			this.checkContainersBreakpoints();
		}
	}

	private getGridAreaStyle = (): React.CSSProperties => {
		const gridAreaStyle = this.props.config && this.props.config.customStyling ? {} : {...styleGridArea};
		const {columns, rows} = this.state.gridTemplate;

		let gridTemplateColumns = "";
		let gridTemplateRows = "";

		for(const col of columns) {
			gridTemplateColumns += col + "fr ";
		}

		for(const row of rows) {
			gridTemplateRows += row + "fr ";
		}

		gridAreaStyle.gridTemplateColumns = gridTemplateColumns;
		gridAreaStyle.gridTemplateRows = gridTemplateRows;

		if(this.state.dndActive) {
			gridAreaStyle.userSelect = "none";
		}

		return gridAreaStyle;
	}
}
