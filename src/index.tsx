import * as React from "react";
import ResizeObserver from 'resize-observer-polyfill';

import { GridUtils } from "./GridContainer/GridUtils";
import { GridElement } from "./GridContainer/GridElement";
import { styleGridArea } from "./GridContainer/style";
import { GridContext } from './GridContainer/GridContext';

import GridManager, { TWorkArea } from './GridManager';
import GridEvents, { DNDEvent } from './events/grid';

export interface GridFrameUpdate {
	template: TGridTemplate;
	elements: TGridElement[];
}

interface GridFrameProps {
	gridId: string;
	template: TGridTemplate;
	elements: TGridElement[];
	components: TGridComponents;
	config: Partial<TGridConfig>;

	onGridUpdate?: (update: GridFrameUpdate) => void;
}

export type TComponentDefaults = {
	props?: {[key: string]: any};
	observe?: {
		adaptive?: TAdaptiveObserve;
	};
};

export type TGridConfigKeybinds = {
	hidePanels: TGridConfigKeybind;
	lockGrid: TGridConfigKeybind;
};

export type TGridConfigKeybind = {
	keyCode: number,
	ctrl?: boolean,
	alt?: boolean,
	shift?: boolean
};

export type TGridComponents = {
	[key: string]: TGridComponent;
};

export type TContextProps = {
	gridElements: TGridElement[];
	gridTemplate: TGridTemplate;
	components: TGridComponents | undefined;
	joinDirection: TCellActionDirection;
	showPanel: boolean;
	config: Partial<TGridConfig>;

	clearDNDState: () => void;
	setElementComponent: (areaId: string, elementId: number, componentId: string | false) => void;
	getDndEvent: () => DNDEvent;
	setDndEvent: (newDnDEvent: Partial<DNDEvent>) => void;
	getWorkArea: () => TWorkArea;
	setWorkArea: (newWorkArea: Partial<TWorkArea>) => void;
	setDnDActive: (newStatus: boolean) => void;
	setFrameElements: (newElements: TGridElement[]) => void;
	changeComponentId: (elementId: number, componentId: string | false) => void;
};

export type TGridComponent = {
	default?: boolean;
	name?: string;
	body: any;
	props: {[key: string]: any};
	gridProps?: {
		components?: boolean;
		elements?: boolean;
		template?: boolean;
	};
	observe?: {
		adaptive?: TAdaptiveObserve;
	};
	overflowVisible?: boolean;
};

export type TAdaptiveObserve = {
	breakpoints?: TAdaptiveBreakpoint[];
	watchOrientation?: boolean;
	defaultBreakpoint?: string;
	resizeTrackStep?: number | false;
};

export type TSizeDimensions = {
	width?: number;
	height?: number;
};

export type TOrientation = "landscape" | "portrait";

export type TAdaptiveBreakpoint = {
	name: string;
	orientation?: TOrientation;
	max?: TSizeDimensions;
	min?: TSizeDimensions;
};

export type TCellActionDirection = "left" | "right" | "bottom" | "top" | "none";

export type TSplitDirection = {
	isSplit: boolean;
	isHorizontal: boolean
	isVertical: boolean
};

export type TEventOriginPos = {
	clientX: number;
	clientY: number;
	pageX: number;
	pageY: number;
};

export type TDefaultComponent = {
	id: string;
	container: TGridComponent;
};

export type TGridConfig = {
	componentsDefaults: TComponentDefaults;
	gridAreaClassName: string;
	classPrefix: string;
	idPrefix: string;
	customStyling: boolean;
	allowSubGrid: boolean;
	isSubGrid: boolean;
	keybinds: TGridConfigKeybinds;

	hidePanel: boolean;
	lockGrid: boolean;
};

export type TGridTemplate = {
	columns: number[];
	rows: number[];
};

export type TGridElementAxis = {
	start: number;
	end: number;
};

export type TGridElement = {
	column: TGridElementAxis;
	row: TGridElementAxis;
	id: number;
	componentId: string | false;
	props: {};
};

export interface GridFrameState {
	gridTemplate: TGridTemplate;
	gridElements: TGridElement[];

	dndActive: boolean;
	joinDirection: TCellActionDirection;

	showPanel: boolean;
}

export default class GridFrame extends React.Component<Partial<GridFrameProps>, GridFrameState> {

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

	private gridFrameContext: TContextProps;

	private events: GridEvents;

	private gridManager: GridManager;

	public constructor(props: GridFrameProps) {
		super(props);

		this.gridManager = new GridManager(props);
		this.events = new GridEvents(this.gridManager);

		this.gridManager.workArea.gridAreaId = this.processGridId(this.props.gridId, this.gridManager.workArea.gridIdPrefix);

		GridFrame.EXEMPLARS.push({
			id: this.gridManager.workArea.gridAreaId,
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

	public render() {
		const {gridAreaClassName, classPrefix, gridAreaId} = this.gridManager.workArea;

		//TODO: huh? should this be here?
		this.setContext();

		const gridContainerStyle: React.CSSProperties = this.getGridAreaStyle();
		let className = gridAreaClassName;
		if(this.props.config && this.props.config.isSubGrid) {
			className += " " + classPrefix + "frame_subgrid";
		}

		return (
			<GridContext.Provider value={this.gridFrameContext}>
				<div
					id={gridAreaId}
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

	public componentDidMount() {
		const {gridAreaId} = this.gridManager.workArea;
		this.gridManager.workArea.gridHTMLContainer = document.getElementById(gridAreaId) || undefined;
		this.gridManager.setContainersActualSizes(this.state.gridTemplate);

		this.updateGridElementsList();

		const ro = new ResizeObserver((entries, observer) => {
			this.gridManager.checkContainersBreakpoints();
		});

		this.gridManager.workArea.gridHTMLContainer && ro.observe(this.gridManager.workArea.gridHTMLContainer);

		document.addEventListener("keyup", this.onKeyUp);
	}

	public componentDidUpdate() {
		this.updateGridElementsList();
	}

	public componentWillUnmount() {
		const {gridAreaId} = this.gridManager.workArea;
		document.removeEventListener("keyup", this.onKeyUp);

		GridFrame.USED_IDS = GridFrame.USED_IDS.filter(id => id !== gridAreaId);

		//TODO: check that it is deleted correctly
		GridFrame.EXEMPLARS = GridFrame.EXEMPLARS.filter(instance => instance.id !== gridAreaId);
	}

	private setContext = () => {
		this.gridFrameContext = {
			gridElements: this.state.gridElements,
			gridTemplate: this.state.gridTemplate,
			components: this.props.components,
			joinDirection: this.state.joinDirection,
			showPanel: this.state.showPanel,
			config: this.props.config as Partial<TGridConfig>,

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

	private setFrameElements = (newElements: TGridElement[]) => {
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
		return this.gridManager.workArea;
	}

	private setWorkArea = (newWorkArea: Partial<TWorkArea>) => {
		for(const item in newWorkArea) {
			if(this.gridManager.workArea.hasOwnProperty(item)) this.gridManager.workArea[item] = newWorkArea[item];
		}
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
		const {gridAreaId, defaultComponent, gridIdPrefix} = this.gridManager.workArea;

		const elements: JSX.Element[] = [];
		this.events.dndEvent.joinTargetElement = undefined;
		const components = this.props.components ? {...this.props.components} : {};

		if(this.props.config && this.props.config.allowSubGrid && !components[GridElement.SUBGRID_ID]) {
			const props: Partial<GridFrameProps> = {
				gridId: gridAreaId,
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
			let component: TGridComponent | undefined = undefined;
			if(element.componentId && this.props.components) {
				component = this.props.components[element.componentId];
			} else if(defaultComponent) {
				component = defaultComponent.container;
			}
			
			//move this methods to contex api
			elements.push(
				<GridElement
					key={`${gridIdPrefix}cell-${element.id}`}
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

	private onGridMouseDown = (e: React.MouseEvent<HTMLElement>) => {
		const {allowGridResize} = this.gridManager.workArea;
		if(!allowGridResize) return;

		if(this.events.dndEvent.lineHorizontal !== false || this.events.dndEvent.lineVertical !== false) {

			const {clientX, clientY, pageX, pageY} = e;

			this.events.dndEvent.eventOriginPos = {
				clientX, clientY, pageX, pageY
			};

			this.events.dndEvent.type = "resize";

			this.gridManager.setContainersActualSizes(this.state.gridTemplate);
			this.events.dndEvent.columnsClone = this.state.gridTemplate.columns.slice();
			this.events.dndEvent.rowsClone = this.state.gridTemplate.rows.slice();

			this.setState({dndActive: true});
		}
	}

	private onCellSplit = (direction: TSplitDirection) => {
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
			this.events.onCellResize({clientX, clientY, gridTemplate: this.state.gridTemplate});

			this.gridManager.checkContainersBreakpoints();
		}
		
	}

	private onGridMouseMove = (e: React.MouseEvent<HTMLElement>) => {
		const {allowGridResize} = this.gridManager.workArea;

		if(this.state.dndActive) {
			this.onDNDActiveMove(e);
		} else {
			if(!this.events.dndEvent.currentContainerRect || !this.events.dndEvent.currentContainer || !this.events.dndEvent.currentElement) return;
			if(!allowGridResize) return;

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
			this.gridManager.workArea.allowGridResize = !this.gridManager.workArea.allowGridResize;
		}
	}

	private updateGridElementsList = () => {
		const {gridAreaId, classPrefix, gridHTMLContainer} = this.gridManager.workArea;

		if(gridHTMLContainer) {
			const selector = `#${gridAreaId} > .${classPrefix}container`;
			this.gridManager.workArea.gridHTMLElements = document.querySelectorAll(selector);

			this.gridManager.checkContainersBreakpoints();
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
