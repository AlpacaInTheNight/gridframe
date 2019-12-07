
export class GridUtils {

	private static readonly DND_TRIGGER_DISTANCE = 40;

	public static isTargedOfJoining = (
		element: IGridFrame.gridElement,
		currentElement: IGridFrame.gridElement | undefined,
		direction: IGridFrame.cellActionDirection
		): boolean => {

		if(direction === "none" || !currentElement) return false;

		const {row, column} = currentElement;

		if(	direction === "bottom" &&
			element.row.start === row.end &&
			element.column.start <= column.start &&
			element.column.end > column.start
		) {
			return true;

		} else if( direction === "top" &&
			element.row.end === row.start &&
			element.column.start <= column.start &&
			element.column.end > column.start
		) {
			return true;

		} else if( direction === "left" &&
			element.column.end === column.start &&
			element.row.start <= row.start &&
			element.row.end > row.start
		) {
			return true;

		} else if( direction === "right" &&
			element.column.start === column.end &&
			element.row.start <= row.start &&
			element.row.end > row.start
		) {
			return true;
		}
		
		return false;
	}

	public static canJointSplit = (
		gridElement: IGridFrame.gridElement,
		currentElement: IGridFrame.gridElement | undefined,
		direction: IGridFrame.cellActionDirection
		): boolean => {

		if(!direction || direction === "none" || !currentElement) return false;
		const originColumn = currentElement.column;
		const targetColumn = gridElement.column;

		const originRow = currentElement.row;
		const targetRow = gridElement.row;

		if(direction === "bottom" || direction === "top") {
			if(originColumn.start === targetColumn.start && originColumn.end < targetColumn.end) return true;
			if(originColumn.end === targetColumn.end && originColumn.start > targetColumn.start) return true;
		}

		if(direction === "left" || direction === "right") {
			if(originRow.start === targetRow.start && originRow.end < targetRow.end) return true;
			if(originRow.end === targetRow.end && originRow.start > targetRow.start) return true;
		}
		
		return false;
	}

	public static joinIsPossible = (
		joinTargetElement: IGridFrame.gridElement,
		currentElement: IGridFrame.gridElement | undefined,
		direction: IGridFrame.cellActionDirection
		): boolean => {

		if(!direction || direction === "none") return false;

		if(!joinTargetElement || !currentElement) return false;

		if(direction === "bottom" || direction === "top") {
			if(joinTargetElement.column.start !== currentElement.column.start) return false;
			if(joinTargetElement.column.end !== currentElement.column.end) return false;
		}

		if(direction === "left" || direction === "right") {
			if(joinTargetElement.row.start !== currentElement.row.start) return false;
			if(joinTargetElement.row.end !== currentElement.row.end) return false;
		}

		return true;
	}

	public static checkSplitDirection = (pageX: number, pageY: number, eventOriginPos: IGridFrame.eventOriginPos) => {
		//console.log("checkSplitDirection");
		const {pageX: originPageX, pageY: originPageY} = eventOriginPos;
		//console.log(originPageX, originPageY);
		
		const direction: IGridFrame.splitDirection = {
			isSplit: false,
			isHorizontal: false,
			isVertical: false
		};

		const pointX = (pageX - originPageX) ** 2;
		const pointY = (pageY - originPageY) ** 2;

		const distance = Math.ceil( Math.sqrt(pointX + pointY) );

		if(distance > GridUtils.DND_TRIGGER_DISTANCE) {
			direction.isSplit = true;

			if(pointX > pointY) direction.isHorizontal = true;
			else direction.isVertical = true;
		}

		//console.log(direction);
		return direction;
	}

	/**
	 * Removes not used grid columns or rows
	 */
	public static normalizeGrid = (
		gridElements: IGridFrame.gridElement[],
		gridTemplate: IGridFrame.gridTemplate,
		gridFRSize: number
		): IGridFrame.gridTemplate => {

		const columnsUsage: boolean[] = new Array(gridTemplate.columns.length).fill(false);
		const rowsUsage: boolean[] = new Array(gridTemplate.rows.length).fill(false);
		let largestColumn: number = gridFRSize;
		let largedRow: number = gridFRSize;
		
		//find grid lines that arent start of any grid element
		gridElements.forEach(element => {
			columnsUsage[element.column.start - 1] = true;
			rowsUsage[element.row.start - 1] = true;
		});

		//add size of not used columns/rows to the preceding used ones
		gridTemplate.columns.forEach( (column, i) => {
			if(!columnsUsage[i + 1] && gridTemplate.columns[i + 1]) {
				gridTemplate.columns[i] = column + gridTemplate.columns[i + 1];
				if(gridTemplate.columns[i] > largestColumn) largestColumn = gridTemplate.columns[i];
			}
		});

		gridTemplate.rows.forEach( (row, i) => {
			if(!rowsUsage[i + 1] && gridTemplate.rows[i + 1]) {
				gridTemplate.rows[i] = row + gridTemplate.rows[i + 1];
				if(gridTemplate.rows[i] > largedRow) largedRow = gridTemplate.rows[i];
			}
		});

		//adjusting cells fr size to use GridFrame.GRID_FR_SIZE constant as a largest value
		const ratioColumn = largestColumn / gridFRSize;
		const ratioRow = largedRow / gridFRSize;
		
		gridTemplate.columns.forEach( (column, i) => {
			gridTemplate.columns[i] /= ratioColumn;
		});

		gridTemplate.rows.forEach( (row, i) => {
			gridTemplate.rows[i] /= ratioRow;
		});

		//remove non used grid columns/rows
		gridTemplate.columns = gridTemplate.columns.filter( (column, i) => columnsUsage[i] );
		gridTemplate.rows = gridTemplate.rows.filter( (row, i) => rowsUsage[i] );

		//update grid elements to match the new grid template
		for(let index = 1; index <= columnsUsage.length; index++) {
			if(columnsUsage[index - 1]) continue;

			gridElements.forEach(element => {
				if(element.column.end > index) {
					if(gridTemplate.columns.length === 1 || element.column.end !== columnsUsage.length + 1) {
						element.column.end -= 1;
					}
				}

				if(element.column.start > index) {
					element.column.start -= 1;
				}
			});
		}

		for(let index = 1; index <= rowsUsage.length; index++) {
			if(rowsUsage[index - 1]) continue;

			gridElements.forEach(element => {
				if(element.row.end > index) {
					if(gridTemplate.rows.length === 1 || element.row.end !== rowsUsage.length + 1) {
						element.row.end -= 1;
					}
				}

				if(element.row.start > index) {
					element.row.start -= 1;
				}
			});
		}

		return gridTemplate;
	}
}
