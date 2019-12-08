import { GridUtils } from "../GridContainer/GridUtils";
import GridManager from '../GridManager';
import { TGridTemplate, TGridElement, TGridElementAxis } from '../index';

export type DNDEvent = {
	type: "inactive" | "grabber" | "resize" | "join" | "swap"
	eventOriginPos: IGridFrame.eventOriginPos;

	lineHorizontal: number | false;
	lineVertical: number | false;

	columnsClone: number[];
	rowsClone: number[];

	currentContainerRect: DOMRect | ClientRect | undefined;
	currentContainer: HTMLElement | undefined;
	currentElement: TGridElement | undefined;
	joinTargetElement: TGridElement | undefined;

	targetOfDraggable: number | undefined;
	madeDNDSnapshot: boolean;
};

export default class GridEvents {

	/**
	 * Default grid cell size in fr units
	 */
	private static readonly GRID_FR_SIZE = 1000;
	private static readonly GRID_MIN_SIZE = GridEvents.GRID_FR_SIZE * .025;
	private static readonly RESIZE_TRIGGER_DISTANCE = 30;

	private gridManager: GridManager;

	private _dndEvent: DNDEvent = {
		type: "inactive",
		eventOriginPos: {
			clientX: 0,
			clientY: 0,
			pageX: 0,
			pageY: 0
		},
		lineHorizontal: false,
		lineVertical: false,
		columnsClone: [],
		rowsClone: [],

		currentContainerRect: undefined,
		currentContainer: undefined,
		currentElement: undefined,
		joinTargetElement: undefined,
		targetOfDraggable: undefined,
		madeDNDSnapshot: false
	};

	constructor(gridManager: GridManager) {
		this.gridManager = gridManager;
	}

	get dndEvent(): DNDEvent {
		return this._dndEvent;
	}

	public setDndEvent = (newDnDEvent: Partial<DNDEvent>) => {

		for(const item in newDnDEvent) {
			if(this.dndEvent.hasOwnProperty(item)) this.dndEvent[item] = newDnDEvent[item];
		}
	}

	public onUpdateGrid = ({gridTemplate, gridElements, joinDirection}: {
		gridTemplate: TGridTemplate;
		gridElements: TGridElement[];
		joinDirection: IGridFrame.cellActionDirection;
	}): {
		gridTemplate: TGridTemplate;
		gridElements: TGridElement[];
	} | false => {

		const {dndEvent} = this;

		if(dndEvent.type === "inactive") return false;

		if(dndEvent.type === "resize") {

			gridTemplate.columns = dndEvent.columnsClone;
			gridTemplate.rows = dndEvent.rowsClone;

			dndEvent.currentContainer = undefined;
			dndEvent.currentElement = undefined;

		} else if(dndEvent.type === "join" && dndEvent.joinTargetElement && dndEvent.currentElement) {
			const joinTargedId = dndEvent.joinTargetElement.id;
			const joinTarged: TGridElement = dndEvent.joinTargetElement;

			//if joining splits the target - update its grid boundaries
			if(GridUtils.canJointSplit(joinTarged, dndEvent.currentElement, joinDirection)) {
				switch(joinDirection) {
					case "bottom":
					case "top":
						if(joinTarged.column.start < dndEvent.currentElement.column.start) {
							joinTarged.column.end = dndEvent.currentElement.column.start;
						} else {
							joinTarged.column.start = dndEvent.currentElement.column.end;
						}
						break;
	
					case "right":
					case "left":
						if(joinTarged.row.start < dndEvent.currentElement.row.start) {
							joinTarged.row.end = dndEvent.currentElement.row.start;
						} else {
							joinTarged.row.start = dndEvent.currentElement.row.end;
						}
						break;
				}
			//if joining replaces target - remove it from the grid
			} else {
				gridElements = gridElements.filter( element => element.id !== joinTargedId);
			}

			//update joining source element to the new grid boundaries
			switch(joinDirection) {
				case "bottom":
					dndEvent.currentElement.row.end = joinTarged.row.end;
					break;

				case "top":
					dndEvent.currentElement.row.start = joinTarged.row.start;
					break;

				case "right":
					dndEvent.currentElement.column.end = joinTarged.column.end;
					break;

				case "left":
					dndEvent.currentElement.column.start = joinTarged.column.start;
					break;
			}

			gridElements.some( element => {
				if(element.id === (dndEvent.currentElement as TGridElement).id) {
					element = dndEvent.currentElement as TGridElement;
					return true;
				}
				return false;
			});

			//const gridTemplate = this.normalizeGrid(gridElements);
			gridTemplate = GridUtils.normalizeGrid(gridElements, gridTemplate, GridEvents.GRID_FR_SIZE);

			return {gridTemplate, gridElements};
		}

		//this.clearDNDEvent();
		return false;
	}

	/* public onGridMouseDown = ({eventOriginPos, gridTemplate}: {
		eventOriginPos: IGridFrame.eventOriginPos;
		gridTemplate: IGridFrame.gridTemplate;
	}) => {
		const {lineHorizontal, lineVertical} = this.dndEvent;
		if(lineHorizontal === false || lineVertical === false) return;

		this.dndEvent.eventOriginPos = eventOriginPos;
		this.dndEvent.type = "resize";
		this.dndEvent.columnsClone = gridTemplate.columns.slice();
		this.dndEvent.rowsClone = gridTemplate.rows.slice();
	} */

	public onCellSplit = ({direction, gridTemplate, gridElements}: {
		direction: IGridFrame.splitDirection;
		gridTemplate: TGridTemplate;
		gridElements: TGridElement[];
	}): {
		gridTemplate: TGridTemplate;
		gridElements: TGridElement[];
	} => {
		const {currentElement} = this.dndEvent;
		if(!direction.isSplit || !currentElement) return {gridTemplate, gridElements};

		const newElementAxis: {
			column: TGridElementAxis;
			row: TGridElementAxis;
		} = {
			column: {start: 1, end: 1},
			row: {start: 1, end: 1},
		};

		let nextId = 0;
		gridElements.forEach(element => {
			if(element.id >= nextId) nextId = element.id + 1;
		});

		function setNewElementAxis(
			originElement: TGridElement,
			newElement: {
				column: TGridElementAxis;
				row: TGridElementAxis;
			},
			axisA: "column" | "row",
			id: number
		) {
			const axisB = axisA === "column" ? "row" : "column";

			newElement[axisB] = {
				start: originElement[axisB].start,
				end: originElement[axisB].end
			};

			//if addition of new line is not required
			if(originElement[axisA].start + 1 !== originElement[axisA].end) {

				newElement[axisA] = {
					start: originElement[axisA].start + 1,
					end: originElement[axisA].end
				};

				gridElements.some(element => {
					if(element.id === originElement.id) {
						element[axisA].end = element[axisA].start + 1;
						return true;
					}

					return false;
				});

			//if a new grid line is required to make a split
			} else {
				const templateAxis = axisA === "column" ? gridTemplate.columns : gridTemplate.rows;
				const line = originElement[axisA].start - 1;
				const halfSize = templateAxis[line] /= 2;
				const elementId = originElement.id;

				const splitLineStart = originElement[axisA].start;

				templateAxis.splice(line, 0, halfSize);

				gridElements.forEach(element => {
					if(element[axisA].start > splitLineStart) {
						element[axisA].start += 1;
					}

					if(element[axisA].end > splitLineStart && element.id !== elementId) {
						element[axisA].end += 1;
					}
				});

				newElement[axisA] = {
					start: originElement[axisA].end,
					end: originElement[axisA].end + 1
				};
			}
		}

		if(direction.isHorizontal) {
			setNewElementAxis(
				currentElement,
				newElementAxis,
				"column",
				currentElement.id
			);

		} else {
			setNewElementAxis(
				currentElement,
				newElementAxis,
				"row",
				currentElement.id
			);
		}

		gridElements.push({
			column: newElementAxis.column,
			row: newElementAxis.row,
			id: nextId,
			componentId: false,
			props: {}
		});

		return {gridTemplate, gridElements};
	}

	public onGridMouseMove = ({clientX, clientY, gridTemplate}: {
		gridTemplate: TGridTemplate;
		clientX: number;
		clientY: number;
	}) => {
		if(!this.dndEvent.currentContainerRect || !this.dndEvent.currentContainer || !this.dndEvent.currentElement) return;

		//const {col: containerCol, row: containerRow} = this.currentContainer.dataset;
		const colMax = gridTemplate.columns.length + 1;
		const rowMax = gridTemplate.rows.length + 1;

		const colStart = this.dndEvent.currentElement.column.start - 1;
		const rowStart = this.dndEvent.currentElement.row.start - 1;

		const colEnd = this.dndEvent.currentElement.column.end;
		const rowEnd = this.dndEvent.currentElement.row.end;

		const spread = GridEvents.RESIZE_TRIGGER_DISTANCE;
		const {left, top, width, height} = this.dndEvent.currentContainerRect;
		let isHorizontalBorder: boolean = false;
		let isVerticalBorder: boolean = false;
		let isTop: boolean = false;
		let isLeft: boolean = false;

		if( colStart !== 0 && left + spread > clientX ) {
			isHorizontalBorder = true;
			isLeft = true;
		}

		if( colEnd !== colMax && left + width - spread < clientX ) {
			isHorizontalBorder = true;
		}

		if( rowStart !== 0 && top + spread > clientY ) {
			isVerticalBorder = true;
			isTop = true;
		}

		if( rowEnd !== rowMax && top + height - spread < clientY ) {
			isVerticalBorder = true;
		}

		if(isHorizontalBorder && !isVerticalBorder) {
			this.dndEvent.currentContainer.style.cursor = "ew-resize";

		} else if(!isHorizontalBorder && isVerticalBorder) {
			this.dndEvent.currentContainer.style.cursor = "ns-resize";

		} else if(isHorizontalBorder && isVerticalBorder) {

			if(isTop && isLeft || !isTop && !isLeft) {
				this.dndEvent.currentContainer.style.cursor = "nwse-resize";
			} else {
				this.dndEvent.currentContainer.style.cursor = "nesw-resize";
			}

		} else {
			this.dndEvent.currentContainer.style.removeProperty("cursor");
		}

		//TODO: dont fire that if cursor is not near the border
		this.setDraggedGridLine(isHorizontalBorder, isVerticalBorder, isTop, isLeft);
	}

	public onCellResize = ({gridTemplate, clientX, clientY}: {
		gridTemplate: TGridTemplate;
		clientX: number;
		clientY: number;
	}) => {
		const {gridHTMLContainer, flexFactor} = this.gridManager.workArea;

		if(!gridHTMLContainer) return;
		const {col: colFactor, row: rowFactor} = flexFactor;

		function updateSize(cells: number[], cellsOrigin: number[], moved: number, lineNumber: number) {
			let gridTemplateStyle = "";

			const indexA = lineNumber;
			const indexB = lineNumber + 1;

			const newValueA = +(cellsOrigin[indexA] + moved).toFixed(3);
			const newValueB = +(cellsOrigin[indexB] - moved).toFixed(3);

			if(newValueA > GridEvents.GRID_MIN_SIZE && newValueB > GridEvents.GRID_MIN_SIZE) {
				cells[indexA] = +(cellsOrigin[indexA] + moved).toFixed(3);
				cells[indexB] = +(cellsOrigin[indexB] - moved).toFixed(3);
			}

			for(const cell of cells) {
				gridTemplateStyle += cell + "fr ";
			}

			return gridTemplateStyle;
		}

		if(this.dndEvent.lineHorizontal !== false) {
			const movedX = (clientX - this.dndEvent.eventOriginPos.clientX) * colFactor;

			gridHTMLContainer.style.gridTemplateColumns = updateSize(
				this.dndEvent.columnsClone,
				gridTemplate.columns,
				movedX,
				this.dndEvent.lineHorizontal
			);
		}

		if(this.dndEvent.lineVertical !== false) {
			const movedY = (clientY - this.dndEvent.eventOriginPos.clientY) * rowFactor;

			gridHTMLContainer.style.gridTemplateRows = updateSize(
				this.dndEvent.rowsClone,
				gridTemplate.rows,
				movedY,
				this.dndEvent.lineVertical
			);
		}
	}

	/* private clearDNDEvent = () => {
		this.dndEvent.lineHorizontal = false;
		this.dndEvent.lineVertical = false;

		this.dndEvent.joinTargetElement = undefined;
		this.dndEvent.targetOfDraggable = undefined;
		this.dndEvent.madeDNDSnapshot = false;

		this.dndEvent.type = "inactive";
	} */

	private setDraggedGridLine = (isHorizontal: boolean, isVertical: boolean, isTop: boolean, isLeft: boolean) => {
		const {currentElement} = this.dndEvent;
		if(!currentElement) return;

		let lineHorizontal: number | false = false;
		let lineVertical: number | false = false;

		if(isHorizontal) {
			if(isLeft) {
				lineHorizontal = currentElement.column.start - 2;
			} else {
				lineHorizontal = currentElement.column.end - 2;
			}
		}

		if(isVertical) {
			if(isTop) {
				lineVertical = currentElement.row.start - 2;
			} else {
				lineVertical = currentElement.row.end - 2;
			}
		}

		this.dndEvent.lineHorizontal = lineHorizontal;
		this.dndEvent.lineVertical = lineVertical;
	}
}
