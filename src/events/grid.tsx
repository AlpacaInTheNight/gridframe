import * as React from "react";
import { GridUtils } from "../GridContainer/GridUtils";

export type DNDEvent = {
	type: "inactive" | "grabber" | "resize" | "join" | "swap"
	eventOriginPos: IGridFrame.eventOriginPos;

	lineHorizontal: number | false;
	lineVertical: number | false;

	columnsClone: number[];
	rowsClone: number[];

	currentContinerRect: DOMRect | ClientRect | undefined;
	currentContainer: HTMLElement | undefined;
	currentElement: IGridFrame.gridElement | undefined;
	joinTargetElement: IGridFrame.gridElement | undefined;

	targetOfDraggable: number | undefined;
	madeDNDSnapshot: boolean;
};

export default class GridEvents {

	/**
	 * Default grid cell size in fr units
	 */
	private static readonly GRID_FR_SIZE = 1000;
	private static readonly GRID_MIN_SIZE = GridEvents.GRID_FR_SIZE * .025;

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

		currentContinerRect: undefined,
		currentContainer: undefined,
		currentElement: undefined,
		joinTargetElement: undefined,
		targetOfDraggable: undefined,
		madeDNDSnapshot: false
	};

	constructor() {

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
		gridTemplate: IGridFrame.gridTemplate;
		gridElements: IGridFrame.gridElement[];
		joinDirection: IGridFrame.cellActionDirection;
	}): {
		gridTemplate: IGridFrame.gridTemplate;
		gridElements: IGridFrame.gridElement[];
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
			const joinTarged: IGridFrame.gridElement = dndEvent.joinTargetElement;

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
				if(element.id === (dndEvent.currentElement as IGridFrame.gridElement).id) {
					element = dndEvent.currentElement as IGridFrame.gridElement;
					return true;
				}
				return false;
			});

			//const gridTemplate = this.normalizeGrid(gridElements);
			gridTemplate = GridUtils.normalizeGrid(gridElements, gridTemplate, GridEvents.GRID_FR_SIZE);

			return {gridTemplate, gridElements};
		}

		this.clearDNDEvent();
		return false;
	}

	public onGridMouseDown = ({eventOriginPos, gridTemplate}: {
		eventOriginPos: IGridFrame.eventOriginPos;
		gridTemplate: IGridFrame.gridTemplate;
	}) => {
		const {lineHorizontal, lineVertical} = this.dndEvent;
		if(lineHorizontal === false || lineVertical === false) return;

		this.dndEvent.eventOriginPos = eventOriginPos;
		this.dndEvent.type = "resize";
		this.dndEvent.columnsClone = gridTemplate.columns.slice();
		this.dndEvent.rowsClone = gridTemplate.rows.slice();
	}

	public onCellSplit = ({direction, gridTemplate, gridElements}: {
		direction: IGridFrame.splitDirection;
		gridTemplate: IGridFrame.gridTemplate;
		gridElements: IGridFrame.gridElement[];
	}): {
		gridTemplate: IGridFrame.gridTemplate;
		gridElements: IGridFrame.gridElement[];
	} => {
		const {currentElement} = this.dndEvent;
		if(!direction.isSplit || !currentElement) return {gridTemplate, gridElements};

		const newElementAxis: {
			column: IGridFrame.gridElementAxis;
			row: IGridFrame.gridElementAxis;
		} = {
			column: {start: 1, end: 1},
			row: {start: 1, end: 1},
		};

		let nextId = 0;
		gridElements.forEach(element => {
			if(element.id >= nextId) nextId = element.id + 1;
		});

		function setNewElementAxis(
			originElement: IGridFrame.gridElement,
			newElement: {
				column: IGridFrame.gridElementAxis;
				row: IGridFrame.gridElementAxis;
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

	private clearDNDEvent = () => {
		this.dndEvent.lineHorizontal = false;
		this.dndEvent.lineVertical = false;

		this.dndEvent.joinTargetElement = undefined;
		this.dndEvent.targetOfDraggable = undefined;
		this.dndEvent.madeDNDSnapshot = false;

		this.dndEvent.type = "inactive";
	}
}
