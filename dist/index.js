(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('react'), require('resize-observer-polyfill')) :
	typeof define === 'function' && define.amd ? define(['react', 'resize-observer-polyfill'], factory) :
	(global = global || self, global.ContentResizer = factory(global.React, global.ResizeObserver));
}(this, (function (React, ResizeObserver) { 'use strict';

	ResizeObserver = ResizeObserver && ResizeObserver.hasOwnProperty('default') ? ResizeObserver['default'] : ResizeObserver;

	class GridUtils {
	}
	GridUtils.DND_TRIGGER_DISTANCE = 40;
	GridUtils.isTargedOfJoining = (element, currentElement, direction) => {
	    if (direction === "none" || !currentElement)
	        return false;
	    const { row, column } = currentElement;
	    if (direction === "bottom" &&
	        element.row.start === row.end &&
	        element.column.start <= column.start &&
	        element.column.end > column.start) {
	        return true;
	    }
	    else if (direction === "top" &&
	        element.row.end === row.start &&
	        element.column.start <= column.start &&
	        element.column.end > column.start) {
	        return true;
	    }
	    else if (direction === "left" &&
	        element.column.end === column.start &&
	        element.row.start <= row.start &&
	        element.row.end > row.start) {
	        return true;
	    }
	    else if (direction === "right" &&
	        element.column.start === column.end &&
	        element.row.start <= row.start &&
	        element.row.end > row.start) {
	        return true;
	    }
	    return false;
	};
	GridUtils.canJointSplit = (gridElement, currentElement, direction) => {
	    if (!direction || direction === "none" || !currentElement)
	        return false;
	    const originColumn = currentElement.column;
	    const targetColumn = gridElement.column;
	    const originRow = currentElement.row;
	    const targetRow = gridElement.row;
	    if (direction === "bottom" || direction === "top") {
	        if (originColumn.start === targetColumn.start && originColumn.end < targetColumn.end)
	            return true;
	        if (originColumn.end === targetColumn.end && originColumn.start > targetColumn.start)
	            return true;
	    }
	    if (direction === "left" || direction === "right") {
	        if (originRow.start === targetRow.start && originRow.end < targetRow.end)
	            return true;
	        if (originRow.end === targetRow.end && originRow.start > targetRow.start)
	            return true;
	    }
	    return false;
	};
	GridUtils.joinIsPossible = (joinTargetElement, currentElement, direction) => {
	    if (!direction || direction === "none")
	        return false;
	    if (!joinTargetElement || !currentElement)
	        return false;
	    if (direction === "bottom" || direction === "top") {
	        if (joinTargetElement.column.start !== currentElement.column.start)
	            return false;
	        if (joinTargetElement.column.end !== currentElement.column.end)
	            return false;
	    }
	    if (direction === "left" || direction === "right") {
	        if (joinTargetElement.row.start !== currentElement.row.start)
	            return false;
	        if (joinTargetElement.row.end !== currentElement.row.end)
	            return false;
	    }
	    return true;
	};
	GridUtils.checkSplitDirection = (pageX, pageY, eventOriginPos) => {
	    const { pageX: originPageX, pageY: originPageY } = eventOriginPos;
	    const direction = {
	        isSplit: false,
	        isHorizontal: false,
	        isVertical: false
	    };
	    const pointX = (pageX - originPageX) ** 2;
	    const pointY = (pageY - originPageY) ** 2;
	    const distance = Math.ceil(Math.sqrt(pointX + pointY));
	    if (distance > GridUtils.DND_TRIGGER_DISTANCE) {
	        direction.isSplit = true;
	        if (pointX > pointY)
	            direction.isHorizontal = true;
	        else
	            direction.isVertical = true;
	    }
	    return direction;
	};
	/**
	 * Removes not used grid columns or rows
	 */
	GridUtils.normalizeGrid = (gridElements, gridTemplate, gridFRSize) => {
	    const columnsUsage = new Array(gridTemplate.columns.length).fill(false);
	    const rowsUsage = new Array(gridTemplate.rows.length).fill(false);
	    let largestColumn = gridFRSize;
	    let largedRow = gridFRSize;
	    //find grid lines that arent start of any grid element
	    gridElements.forEach(element => {
	        columnsUsage[element.column.start - 1] = true;
	        rowsUsage[element.row.start - 1] = true;
	    });
	    //add size of not used columns/rows to the preceding used ones
	    gridTemplate.columns.forEach((column, i) => {
	        if (!columnsUsage[i + 1] && gridTemplate.columns[i + 1]) {
	            gridTemplate.columns[i] = column + gridTemplate.columns[i + 1];
	            if (gridTemplate.columns[i] > largestColumn)
	                largestColumn = gridTemplate.columns[i];
	        }
	    });
	    gridTemplate.rows.forEach((row, i) => {
	        if (!rowsUsage[i + 1] && gridTemplate.rows[i + 1]) {
	            gridTemplate.rows[i] = row + gridTemplate.rows[i + 1];
	            if (gridTemplate.rows[i] > largedRow)
	                largedRow = gridTemplate.rows[i];
	        }
	    });
	    //adjusting cells fr size to use GridFrame.GRID_FR_SIZE constant as a largest value
	    const ratioColumn = largestColumn / gridFRSize;
	    const ratioRow = largedRow / gridFRSize;
	    gridTemplate.columns.forEach((column, i) => {
	        gridTemplate.columns[i] /= ratioColumn;
	    });
	    gridTemplate.rows.forEach((row, i) => {
	        gridTemplate.rows[i] /= ratioRow;
	    });
	    //remove non used grid columns/rows
	    gridTemplate.columns = gridTemplate.columns.filter((column, i) => columnsUsage[i]);
	    gridTemplate.rows = gridTemplate.rows.filter((row, i) => rowsUsage[i]);
	    //update grid elements to match the new grid template
	    for (let index = 1; index <= columnsUsage.length; index++) {
	        if (columnsUsage[index - 1])
	            continue;
	        gridElements.forEach(element => {
	            if (element.column.end > index) {
	                if (gridTemplate.columns.length === 1 || element.column.end !== columnsUsage.length + 1) {
	                    element.column.end -= 1;
	                }
	            }
	            if (element.column.start > index) {
	                element.column.start -= 1;
	            }
	        });
	    }
	    for (let index = 1; index <= rowsUsage.length; index++) {
	        if (rowsUsage[index - 1])
	            continue;
	        gridElements.forEach(element => {
	            if (element.row.end > index) {
	                if (gridTemplate.rows.length === 1 || element.row.end !== rowsUsage.length + 1) {
	                    element.row.end -= 1;
	                }
	            }
	            if (element.row.start > index) {
	                element.row.start -= 1;
	            }
	        });
	    }
	    return gridTemplate;
	};

	class GridContainer extends React.Component {
	    constructor(props) {
	        super(props);
	        this.processResize = () => {
	            const { resizeTrackStep, breakpoints: watchBreakpoints, watchOrientation } = this.props.adaptiveObserve;
	            const target = this.target;
	            if (!target)
	                return;
	            //TODO: replace this with default props
	            const responsiveStep = resizeTrackStep ? resizeTrackStep : false;
	            const breakpoints = watchBreakpoints ? watchBreakpoints : false;
	            let orientation = false;
	            const newState = {};
	            let width = Number(target.dataset.width);
	            let height = Number(target.dataset.height);
	            if (watchOrientation) {
	                if (width <= height) {
	                    orientation = "landscape";
	                }
	                else if (width > height) {
	                    orientation = "portrait";
	                }
	                newState.orientation = orientation;
	            }
	            if (responsiveStep) {
	                if (Number.isInteger(width)) {
	                    width = Math.floor(width / responsiveStep) * responsiveStep;
	                    if (this.state.width !== width) {
	                        newState.width = width;
	                    }
	                }
	                if (Number.isInteger(height)) {
	                    height = Math.floor(height / responsiveStep) * responsiveStep;
	                    if (this.state.height !== height) {
	                        newState.height = height;
	                    }
	                }
	            }
	            else {
	                if (this.state.width !== 0)
	                    newState.width = 0;
	                if (this.state.height !== 0)
	                    newState.height = 0;
	            }
	            if (breakpoints) {
	                breakpoints.some(breakpoint => {
	                    let fulfill = true;
	                    if (breakpoint.orientation) {
	                        if (breakpoint.orientation === "landscape" && width < height) {
	                            fulfill = false;
	                        }
	                        if (breakpoint.orientation === "portrait" && width > height) {
	                            fulfill = false;
	                        }
	                    }
	                    if (breakpoint.min && fulfill) {
	                        if (breakpoint.min.width && (width < breakpoint.min.width)) {
	                            fulfill = false;
	                        }
	                        if (breakpoint.min.height && (height < breakpoint.min.height)) {
	                            fulfill = false;
	                        }
	                    }
	                    if (breakpoint.max && fulfill) {
	                        if (breakpoint.max.width && (width > breakpoint.max.width)) {
	                            fulfill = false;
	                        }
	                        if (breakpoint.max.height && (height > breakpoint.max.height)) {
	                            fulfill = false;
	                        }
	                    }
	                    if (fulfill) {
	                        if (this.state.breakpointName !== breakpoint.name) {
	                            newState.breakpointName = breakpoint.name;
	                        }
	                    }
	                    return fulfill;
	                });
	            }
	            else if (newState.breakpointName !== "") {
	                newState.breakpointName = "";
	            }
	            if (newState.width !== undefined || newState.height !== undefined || newState.breakpointName !== undefined) {
	                this.setState(newState);
	            }
	        };
	        this.addObserver = () => {
	            if (!this.props.adaptiveObserve)
	                return;
	            const { resizeTrackStep, breakpoints: watchBreakpoints, watchOrientation } = this.props.adaptiveObserve;
	            //TODO: replace this with ref in render
	            const target = document.getElementById(this.props.htmlContainerId);
	            this.target = target;
	            if (!target)
	                return;
	            const responsiveStep = resizeTrackStep ? resizeTrackStep : false;
	            const breakpoints = watchBreakpoints ? watchBreakpoints : false;
	            if (responsiveStep || breakpoints || watchOrientation) {
	                this.observer = new MutationObserver(mutations => mutations.forEach(mutation => {
	                    if (mutation.attributeName === "data-width" || mutation.attributeName === "data-height") {
	                        this.processResize();
	                    }
	                }));
	                const config = { attributes: true, attributeOldValue: true, childList: false, characterData: false };
	                this.observer.observe(target, config);
	            }
	        };
	        const state = {
	            width: 0,
	            height: 0,
	            breakpointName: false,
	            orientation: false
	        };
	        this.state = state;
	    }
	    render() {
	        const { body: CONTAINER, changeComponentId, containerId } = this.props;
	        const { userProps } = this.props.props;
	        return (React.createElement(CONTAINER, Object.assign({ width: this.state.width, height: this.state.height, breakpoint: this.state.breakpointName, orientation: this.state.orientation, changeComponentId: changeComponentId, containerId: containerId }, userProps)));
	    }
	    shouldComponentUpdate(nextProps, nextState) {
	        //TODO: check if resizeObserver did change
	        this.observer && this.observer.disconnect();
	        this.addObserver();
	        if (this.props.body !== nextProps.body)
	            return true;
	        for (const index in nextState) {
	            if (nextState[index] !== this.state[index]) {
	                return true;
	            }
	        }
	        //TODO: add recursive check
	        for (const index in nextProps) {
	            if (nextProps[index] !== this.props[index]) {
	                return true;
	            }
	        }
	        return false;
	    }
	    componentDidUpdate() {
	        this.processResize();
	    }
	    componentDidMount() {
	        this.addObserver();
	    }
	    componentWillUnmount() {
	        this.observer && this.observer.disconnect();
	    }
	}

	const panelSize = 30;
	const borderColor = "black";
	const panelHeight = panelSize + "px";
	/**
	 * Бессмысленно и беспощадно
	 */
	const joinPNG = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAYAAADFeBvrAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDY1REJFMUIwQjEzMTFFOTg4NTg4Njk3M0YzREVGRUQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MDY1REJFMUMwQjEzMTFFOTg4NTg4Njk3M0YzREVGRUQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowNjVEQkUxOTBCMTMxMUU5ODg1ODg2OTczRjNERUZFRCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowNjVEQkUxQTBCMTMxMUU5ODg1ODg2OTczRjNERUZFRCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PmVsGaQAAADESURBVHja7NrLDoMwDERRxuL/f9ktXXTVIiWeBhddS+zI48RJlCCUmdudIrabBSBAgAABGg5JeTzVd8gQIECAAAECBMgb+/P4MVrmOK58LFS5zp/042t7zgyt+hCRK6dcdsM41lB2wrg2heyCeW0Kpg4NLdwJTK7MkCtTlkw7Qbq4/HvKyTCSMg5Kqf5okBlrfdEMU643GmJK9UdTzHQ7+8SB8ieYk35o5RriPgQIECBAgAAB+qMQ//oAAgQIEKAL4yHAACO0JW9gVjyHAAAAAElFTkSuQmCC')";
	const splitPNG = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAYAAADFeBvrAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MjA2Qjk2OTUwQjEzMTFFOUJBN0U4MjlGQUU5OEZEMzUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MjA2Qjk2OTYwQjEzMTFFOUJBN0U4MjlGQUU5OEZEMzUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoyMDZCOTY5MzBCMTMxMUU5QkE3RTgyOUZBRTk4RkQzNSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoyMDZCOTY5NDBCMTMxMUU5QkE3RTgyOUZBRTk4RkQzNSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PoSBc4oAAADJSURBVHja7NrdDkAwDIZh3+L+b7myEAfYpiaovE0c+Zlnm6qFzGz4U6ThZwEIECBAgNwhyfLWewwjBAgQIECAAAG6N8alDCntz6WJPBe88klfad91T7nt1Djxq2HeKRdh5cTOgiItA1kLFHFNy3ZJoYHxInXnM+FNFCnwyBx2Suro1a+FtlNOhZHSUzfTMT1VSgqKOjK1tK2omNqLVRExreJU0TBrUqgUlI+gnAWt+B4CBAgQIECAAAGa6yL+9QEECBAgQC/GJMAAbPEobZMQ1WoAAAAASUVORK5CYII=')";
	const swapPNG = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAYAAADFeBvrAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QkZBRDcwN0MxMDEyMTFFOTk3MjA5RjU1RTVDRDQ1MDkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QkZBRDcwN0QxMDEyMTFFOTk3MjA5RjU1RTVDRDQ1MDkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpCRkFENzA3QTEwMTIxMUU5OTcyMDlGNTVFNUNENDUwOSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCRkFENzA3QjEwMTIxMUU5OTcyMDlGNTVFNUNENDUwOSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Plkz14UAAADqSURBVHja7JlBDoMwDATZqv//8hahnioiSGI3CZpcEAQsRmuvsZDt7UnrtT1svXselhQq754te0idXc9XKBomKiYpV0qVChVOQ2AKAAEEEEB/s+1al2/Y18wKKfP+USmnJPgYoEL3731ZrWgKioSZxeUUBTOTbSsC5gjACL56Y82YTDNnr8cpRA0BBBBA9CH6EH2IGuqooYuJ1KVP/rvKf2P7bo1kKuSf49Ip54vzpYBceX1qIHfuN9daBpCD7xuqkIOVHGvbBWv2xT6NFSCAAAJomG1X953Gf0YoFAbUO7dkxWQEn319BBgArZlFZ5VBJxsAAAAASUVORK5CYII=')";
	let styleGridArea = {
	    display: "grid",
	    width: "100%",
	    height: "100%",
	    borderBottom: `1px solid ${borderColor}`,
	    borderLeft: `1px solid ${borderColor}`,
	    boxSizing: "border-box",
	};
	let styleGridCell = {
	    position: "relative",
	    display: "flex",
	    flexDirection: "column",
	    borderTop: `1px solid ${borderColor}`,
	    borderRight: `1px solid ${borderColor}`,
	    boxSizing: "border-box",
	};
	let styleGridCellPanel = {
	    display: "flex",
	    flexDirection: "row",
	    flexWrap: "wrap",
	    justifyContent: "space-between",
	    backgroundColor: "#777",
	    flexGrow: 0,
	};
	let styleOverlay = {
	    position: "absolute",
	    top: "0",
	    left: "0",
	    width: "100%",
	    height: "100%",
	    zIndex: 10,
	    opacity: 0.5
	};
	let styleComponentSelector = {
	    height: panelHeight,
	    width: panelHeight,
	    minWidth: panelHeight,
	    maxWidth: "200px",
	    flexGrow: 1,
	};
	let styleButton = {
	    width: panelHeight,
	    height: panelHeight,
	    cursor: "pointer",
	    transition: "0.2s filter",
	    display: "inline-block",
	    borderRadius: panelSize / 2 + "px",
	    backgroundSize: "80%",
	    backgroundRepeat: "no-repeat",
	    backgroundPosition: "center center",
	};
	let styleSplit = Object.assign(Object.assign({}, styleButton), { backgroundColor: "rgb(212, 102, 102)", backgroundImage: splitPNG });
	let styleJoin = Object.assign(Object.assign({}, styleButton), { backgroundColor: "rgb(74, 86, 189)", backgroundImage: joinPNG });
	let styleSwap = Object.assign(Object.assign({}, styleButton), { backgroundColor: "rgb(84, 196, 102)", backgroundImage: swapPNG });

	const GridContext = React.createContext({});

	class GridPanel extends React.Component {
	    constructor(props) {
	        super(props);
	        this.onGrabberStart = (e) => {
	            const { clientX, clientY, pageX, pageY } = e;
	            this.context.setDndEvent({
	                eventOriginPos: { clientX, clientY, pageX, pageY },
	                type: "grabber"
	            });
	            this.context.setDnDActive(true);
	        };
	        this.onJoinerStart = (e) => {
	            const { clientX, clientY, pageX, pageY } = e;
	            this.context.setDndEvent({
	                eventOriginPos: { clientX, clientY, pageX, pageY },
	                type: "join"
	            });
	            this.context.setDnDActive(true);
	        };
	        this.onSwapStart = (e) => {
	            this.context.setDndEvent({
	                type: "swap",
	                targetOfDraggable: this.props.elementId
	            });
	            this.context.setDnDActive(true);
	        };
	        this.showOptions = () => {
	            const options = [];
	            options.push(React.createElement("option", { key: "0" }));
	            for (const index in this.context.components) {
	                const component = this.context.components[index];
	                options.push(React.createElement("option", { key: index, value: index }, component.name ? component.name : index));
	            }
	            return options;
	        };
	        //TODO: remove this. need to use changeComponentId instead
	        this.onChangeComponentId = (e) => {
	            const componentId = e.target.value;
	            const elementId = Number(e.target.dataset.id);
	            this.context.changeComponentId(elementId, componentId);
	        };
	        this.state = {};
	    }
	    render() {
	        const { customStyling } = this.context.config;
	        const { classPrefix } = this.context.getWorkArea();
	        const panelStyle = customStyling ? {} : Object.assign({}, styleGridCellPanel);
	        const selectorStyle = customStyling ? {} : Object.assign({}, styleComponentSelector);
	        const splitStyle = customStyling ? {} : Object.assign({}, styleSplit);
	        const joinStyle = customStyling ? {} : Object.assign({}, styleJoin);
	        const swapStyle = customStyling ? {} : Object.assign({}, styleSwap);
	        return (React.createElement("div", { className: classPrefix + "controlPanel", style: panelStyle },
	            React.createElement("div", { style: splitStyle, "data-grabber": "true", className: classPrefix + "spliter", onMouseDown: this.onGrabberStart }),
	            React.createElement("select", { className: classPrefix + "componentSelector", style: selectorStyle, onChange: this.onChangeComponentId, "data-id": this.props.elementId, value: this.props.componentId || "" }, this.showOptions()),
	            React.createElement("div", { style: swapStyle, "data-grabber": "true", className: classPrefix + "swapper", onMouseDown: this.onSwapStart }),
	            React.createElement("div", { style: joinStyle, "data-grabber": "true", className: classPrefix + "joiner", onMouseDown: this.onJoinerStart })));
	    }
	}
	GridPanel.contextType = GridContext;

	class GridElement extends React.Component {
	    constructor(props) {
	        super(props);
	        /**
	         * Resets currentContainer and currentElement if one of them was unset
	         * TODO: that is extra load and probably not the best solution,
	         * but is used to overcom issue when mouse move from one grid element to another
	         * skiping the borders.
	         */
	        this.onGridContainerMove = (e) => {
	            const { currentContainer, currentElement } = this.context.getDndEvent();
	            if (!currentContainer || !currentElement) {
	                const currentTarget = e.currentTarget;
	                const elementId = Number(currentTarget.dataset.id);
	                this.context.setDndEvent({
	                    currentContainerRect: currentTarget.getBoundingClientRect(),
	                    currentContainer: currentTarget
	                });
	                if (Number.isInteger(elementId)) {
	                    this.context.setDndEvent({
	                        currentElement: this.context.gridElements.find(elem => elem.id === elementId)
	                    });
	                }
	            }
	        };
	        this.onGridContainerEnter = (e) => {
	            const { type } = this.context.getDndEvent();
	            if (type !== "inactive")
	                return;
	            const currentTarget = e.currentTarget;
	            const elementId = Number(currentTarget.dataset.id);
	            this.context.setDndEvent({
	                currentContainerRect: currentTarget.getBoundingClientRect(),
	                currentContainer: currentTarget
	            });
	            if (Number.isInteger(elementId)) {
	                this.context.setDndEvent({
	                    currentElement: this.context.gridElements.find(elem => elem.id === elementId)
	                });
	            }
	        };
	        this.onGridContainerLeave = (e) => {
	            const { currentContainer } = this.context.getDndEvent();
	            if (!currentContainer)
	                return;
	            currentContainer.style.removeProperty("cursor");
	        };
	        this.onContainerDrag = (e) => {
	            const { type, currentElement, currentContainer } = this.context.getDndEvent();
	            const { gridAreaId } = this.context.getWorkArea();
	            const elementId = this.getHTMLId();
	            const target = e.target;
	            //if the source of dnd is not this container
	            if (!target.id || target.id !== elementId) {
	                return;
	            }
	            if (type !== "swap") {
	                if (this.props.element.componentId !== GridElement.SUBGRID_ID) {
	                    e.preventDefault();
	                }
	                return;
	            }
	            else if (currentElement) {
	                const data = {
	                    gridId: gridAreaId,
	                    elementId: currentElement.id,
	                    componentId: currentElement.componentId
	                };
	                if (currentContainer) {
	                    currentContainer.classList.add("dnd_snapshot");
	                }
	                GridElement.preventDNDPropagation = false;
	                e.dataTransfer.setData(GridElement.DND_DATATRANSFER_TYPE, JSON.stringify(data));
	            }
	        };
	        this.onContainerDrop = (e) => {
	            if (GridElement.preventDNDPropagation) {
	                this.context.clearDNDState();
	                return;
	            }
	            const { currentElement } = this.context.getDndEvent();
	            const dataTransfer = e.dataTransfer.getData(GridElement.DND_DATATRANSFER_TYPE);
	            if (!dataTransfer)
	                return;
	            if (!currentElement)
	                return;
	            const data = JSON.parse(dataTransfer);
	            if (!data || !data.gridId || !Number.isInteger(data.elementId))
	                return;
	            const { gridAreaId } = this.context.getWorkArea();
	            const currentTarget = e.currentTarget;
	            const targetId = Number(currentTarget.dataset.id);
	            const gridElements = this.context.gridElements;
	            GridElement.preventDNDPropagation = true;
	            if (data.gridId !== gridAreaId) {
	                const originComponentId = this.props.element.componentId;
	                const componentId = data.componentId ? data.componentId : false;
	                this.context.changeComponentId(this.props.element.id, componentId);
	                this.context.setElementComponent(data.gridId, data.elementId, originComponentId);
	                this.context.clearDNDState();
	                return;
	            }
	            gridElements.some(element => {
	                if (element.id === targetId) {
	                    [element.column, currentElement.column] = [currentElement.column, element.column];
	                    [element.row, currentElement.row] = [currentElement.row, element.row];
	                    return true;
	                }
	                return false;
	            });
	            //drop event dont trigger mouse up event, so we need to trigger it manually
	            this.context.clearDNDState();
	            this.context.setFrameElements(gridElements);
	        };
	        this.getCellStyle = () => {
	            const element = this.props.element;
	            const { customStyling } = this.context.config;
	            let cellStyle = {};
	            if (!customStyling)
	                cellStyle = Object.assign({}, styleGridCell);
	            cellStyle.gridColumnStart = element.column.start;
	            cellStyle.gridColumnEnd = element.column.end;
	            cellStyle.gridRowStart = element.row.start;
	            cellStyle.gridRowEnd = element.row.end;
	            cellStyle.overflow = "auto";
	            if (this.props.component && this.props.component.overflowVisible) {
	                cellStyle.overflow = "visible";
	            }
	            return cellStyle;
	        };
	        this.getComponentContainer = (defaultComponent) => {
	            const { element } = this.props;
	            let componentContainer;
	            if (element.componentId) {
	                if (this.context.components && this.context.components[element.componentId]) {
	                    componentContainer = this.context.components[element.componentId];
	                }
	            }
	            else if (defaultComponent) {
	                componentContainer = defaultComponent.container;
	            }
	            //TODO: I propbably dont need to send them via props, as I use context now. Need to rewrite it.
	            if (componentContainer && componentContainer.gridProps) {
	                if (componentContainer.gridProps.components) {
	                    componentContainer.props.gridComponents = this.context.components;
	                }
	                if (componentContainer.gridProps.elements) {
	                    componentContainer.props.gridElement = this.context.gridElements;
	                }
	                if (componentContainer.gridProps.template) {
	                    componentContainer.props.gridTemplate = this.context.gridTemplate;
	                }
	            }
	            return componentContainer;
	        };
	        this.getAdaptiveObserve = (defaultAdaptiveObserve, componentContainer) => {
	            let adaptiveObserve = {};
	            if (componentContainer && componentContainer.observe && componentContainer.observe.adaptive) {
	                adaptiveObserve = componentContainer.observe.adaptive;
	            }
	            else if (defaultAdaptiveObserve) {
	                adaptiveObserve = defaultAdaptiveObserve;
	            }
	            return adaptiveObserve;
	        };
	        this.checkJoinStatus = () => {
	            let status = "none";
	            const { currentElement } = this.context.getDndEvent();
	            const { element } = this.props;
	            const { joinDirection } = this.context;
	            const targetOfJoining = GridUtils.isTargedOfJoining(element, currentElement, joinDirection);
	            if (joinDirection !== "none" && targetOfJoining) {
	                if (GridUtils.joinIsPossible(element, currentElement, joinDirection)) {
	                    this.context.setDndEvent({ joinTargetElement: element });
	                    status = "merge";
	                }
	                else if (GridUtils.canJointSplit(element, currentElement, joinDirection)) {
	                    this.context.setDndEvent({ joinTargetElement: element });
	                    status = "expand";
	                }
	            }
	            return status;
	        };
	        this.showOverlay = (props) => {
	            const { customStyling } = this.context.config;
	            const { classPrefix } = this.context.getWorkArea();
	            let className = `${classPrefix}cell_overlay`;
	            const overlayStyle = customStyling ? {} : Object.assign({}, styleOverlay);
	            if (customStyling) {
	                className += " " + classPrefix + props.status;
	            }
	            else {
	                if (props.status === "merge") {
	                    overlayStyle.backgroundColor = "red";
	                }
	                if (props.status === "expand") {
	                    overlayStyle.backgroundColor = "green";
	                }
	            }
	            return React.createElement("div", { style: overlayStyle, className: className });
	        };
	        this.getHTMLId = () => {
	            const { gridAreaId } = this.context.getWorkArea();
	            const { element } = this.props;
	            return `${gridAreaId}-container-${element.id}`;
	        };
	        this.onDragOver = (e) => {
	            const { type, madeDNDSnapshot, currentContainer } = this.context.getDndEvent();
	            e.preventDefault();
	            if (type === "swap" && !madeDNDSnapshot && currentContainer) {
	                currentContainer.classList.remove("dnd_snapshot");
	                this.context.setDndEvent({
	                    madeDNDSnapshot: true
	                });
	            }
	        };
	        this.state = {};
	    }
	    render() {
	        const { targetOfDraggable } = this.context.getDndEvent();
	        const { defaultComponent, defaultAdaptiveObserve, classPrefix } = this.context.getWorkArea();
	        const { element } = this.props;
	        const cellStyle = this.getCellStyle();
	        const htmlId = this.getHTMLId();
	        const componentContainer = this.getComponentContainer(defaultComponent);
	        const adaptiveObserve = this.getAdaptiveObserve(defaultAdaptiveObserve, componentContainer);
	        const joinStatus = this.checkJoinStatus();
	        const addClass = targetOfDraggable && targetOfDraggable === element.id ? "dnd_drag" : "";
	        return (React.createElement("div", { style: cellStyle, key: "gridElement:" + element.id, "data-id": element.id, className: classPrefix + "container " + addClass, id: htmlId, onMouseEnter: this.onGridContainerEnter, onMouseLeave: this.onGridContainerLeave, onMouseMove: this.onGridContainerMove, onDragStart: this.onContainerDrag, onDrop: this.onContainerDrop, onDragOver: this.onDragOver, draggable: true },
	            joinStatus !== "none" &&
	                React.createElement(this.showOverlay, { status: joinStatus }),
	            this.context.showPanel &&
	                React.createElement(GridPanel, { elementId: element.id, componentId: this.props.element.componentId || "" }),
	            componentContainer &&
	                React.createElement(GridContainer, { body: componentContainer.body, props: componentContainer.props, containerId: element.id, htmlContainerId: htmlId, changeComponentId: this.context.changeComponentId, adaptiveObserve: adaptiveObserve })));
	    }
	}
	GridElement.contextType = GridContext;
	GridElement.SUBGRID_ID = "__subgrid";
	GridElement.DND_DATATRANSFER_TYPE = "gridframednd";
	GridElement.preventDNDPropagation = false;

	class GridManager {
	    constructor(props) {
	        this._workArea = {
	            gridAreaId: "",
	            gridAreaClassName: "",
	            classPrefix: "",
	            gridHTMLElements: undefined,
	            gridHTMLContainer: undefined,
	            defaultComponent: false,
	            defaultAdaptiveObserve: {},
	            gridIdPrefix: GridManager.DEFAULT_GRID_ID_PREFIX,
	            flexFactor: {
	                col: 1,
	                row: 1
	            },
	            allowGridResize: true,
	        };
	        this.checkContainersBreakpoints = () => {
	            const { gridHTMLElements } = this.workArea;
	            gridHTMLElements && gridHTMLElements.forEach((container) => {
	                if (container.offsetWidth <= 210) {
	                    if (!container.classList.contains("slim")) {
	                        container.classList.add("slim");
	                    }
	                }
	                else if (container.classList.contains("slim")) {
	                    container.classList.remove("slim");
	                }
	                container.dataset.width = container.offsetWidth.toString();
	                container.dataset.height = container.offsetHeight.toString();
	            });
	        };
	        //TODO: rewrite this. I not sure it is needed at current state.
	        this.setContainersActualSizes = (gridTemplate) => {
	            const { gridHTMLContainer } = this.workArea;
	            if (!gridHTMLContainer)
	                return;
	            const flexFactorHorizontal = gridTemplate.columns.reduce((a, b) => a + b, 0) / gridHTMLContainer.offsetWidth;
	            const flexFactorVertical = gridTemplate.rows.reduce((a, b) => a + b, 0) / gridHTMLContainer.offsetHeight;
	            this.workArea.flexFactor = {
	                col: flexFactorHorizontal,
	                row: flexFactorVertical
	            };
	        };
	        const { config, components } = props;
	        for (const componentId in components) {
	            if (components[componentId].default) {
	                this.workArea.defaultComponent = {
	                    id: componentId,
	                    container: components[componentId]
	                };
	                break;
	            }
	        }
	        if (config) {
	            if (config.idPrefix) {
	                this.workArea.gridIdPrefix = config.idPrefix;
	            }
	            if (config.classPrefix) {
	                this.workArea.classPrefix = config.classPrefix;
	            }
	            if (config.componentsDefaults && config.componentsDefaults.observe && config.componentsDefaults.observe.adaptive) {
	                this.workArea.defaultAdaptiveObserve = config.componentsDefaults.observe.adaptive;
	            }
	            if (config.lockGrid) {
	                this.workArea.allowGridResize = false;
	            }
	        }
	        if (config && config.gridAreaClassName) {
	            this.workArea.gridAreaClassName = config.gridAreaClassName;
	        }
	        else {
	            this.workArea.gridAreaClassName = this.workArea.classPrefix + "gridArea";
	        }
	    }
	    get workArea() {
	        return this._workArea;
	    }
	}
	GridManager.DEFAULT_GRID_ID_PREFIX = "grid-";

	class GridEvents {
	    constructor(gridManager) {
	        this._dndEvent = {
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
	        this.setDndEvent = (newDnDEvent) => {
	            for (const item in newDnDEvent) {
	                if (this.dndEvent.hasOwnProperty(item))
	                    this.dndEvent[item] = newDnDEvent[item];
	            }
	        };
	        this.onUpdateGrid = ({ gridTemplate, gridElements, joinDirection }) => {
	            const { dndEvent } = this;
	            if (dndEvent.type === "inactive")
	                return false;
	            if (dndEvent.type === "resize") {
	                gridTemplate.columns = dndEvent.columnsClone;
	                gridTemplate.rows = dndEvent.rowsClone;
	                dndEvent.currentContainer = undefined;
	                dndEvent.currentElement = undefined;
	            }
	            else if (dndEvent.type === "join" && dndEvent.joinTargetElement && dndEvent.currentElement) {
	                const joinTargedId = dndEvent.joinTargetElement.id;
	                const joinTarged = dndEvent.joinTargetElement;
	                //if joining splits the target - update its grid boundaries
	                if (GridUtils.canJointSplit(joinTarged, dndEvent.currentElement, joinDirection)) {
	                    switch (joinDirection) {
	                        case "bottom":
	                        case "top":
	                            if (joinTarged.column.start < dndEvent.currentElement.column.start) {
	                                joinTarged.column.end = dndEvent.currentElement.column.start;
	                            }
	                            else {
	                                joinTarged.column.start = dndEvent.currentElement.column.end;
	                            }
	                            break;
	                        case "right":
	                        case "left":
	                            if (joinTarged.row.start < dndEvent.currentElement.row.start) {
	                                joinTarged.row.end = dndEvent.currentElement.row.start;
	                            }
	                            else {
	                                joinTarged.row.start = dndEvent.currentElement.row.end;
	                            }
	                            break;
	                    }
	                    //if joining replaces target - remove it from the grid
	                }
	                else {
	                    gridElements = gridElements.filter(element => element.id !== joinTargedId);
	                }
	                //update joining source element to the new grid boundaries
	                switch (joinDirection) {
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
	                gridElements.some(element => {
	                    if (element.id === dndEvent.currentElement.id) {
	                        element = dndEvent.currentElement;
	                        return true;
	                    }
	                    return false;
	                });
	                gridTemplate = GridUtils.normalizeGrid(gridElements, gridTemplate, GridEvents.GRID_FR_SIZE);
	                return { gridTemplate, gridElements };
	            }
	            return false;
	        };
	        this.onCellSplit = ({ direction, gridTemplate, gridElements }) => {
	            const { currentElement } = this.dndEvent;
	            if (!direction.isSplit || !currentElement)
	                return { gridTemplate, gridElements };
	            const newElementAxis = {
	                column: { start: 1, end: 1 },
	                row: { start: 1, end: 1 },
	            };
	            let nextId = 0;
	            gridElements.forEach(element => {
	                if (element.id >= nextId)
	                    nextId = element.id + 1;
	            });
	            function setNewElementAxis(originElement, newElement, axisA, id) {
	                const axisB = axisA === "column" ? "row" : "column";
	                newElement[axisB] = {
	                    start: originElement[axisB].start,
	                    end: originElement[axisB].end
	                };
	                //if addition of new line is not required
	                if (originElement[axisA].start + 1 !== originElement[axisA].end) {
	                    newElement[axisA] = {
	                        start: originElement[axisA].start + 1,
	                        end: originElement[axisA].end
	                    };
	                    gridElements.some(element => {
	                        if (element.id === originElement.id) {
	                            element[axisA].end = element[axisA].start + 1;
	                            return true;
	                        }
	                        return false;
	                    });
	                    //if a new grid line is required to make a split
	                }
	                else {
	                    const templateAxis = axisA === "column" ? gridTemplate.columns : gridTemplate.rows;
	                    const line = originElement[axisA].start - 1;
	                    const halfSize = templateAxis[line] /= 2;
	                    const elementId = originElement.id;
	                    const splitLineStart = originElement[axisA].start;
	                    templateAxis.splice(line, 0, halfSize);
	                    gridElements.forEach(element => {
	                        if (element[axisA].start > splitLineStart) {
	                            element[axisA].start += 1;
	                        }
	                        if (element[axisA].end > splitLineStart && element.id !== elementId) {
	                            element[axisA].end += 1;
	                        }
	                    });
	                    newElement[axisA] = {
	                        start: originElement[axisA].end,
	                        end: originElement[axisA].end + 1
	                    };
	                }
	            }
	            if (direction.isHorizontal) {
	                setNewElementAxis(currentElement, newElementAxis, "column", currentElement.id);
	            }
	            else {
	                setNewElementAxis(currentElement, newElementAxis, "row", currentElement.id);
	            }
	            gridElements.push({
	                column: newElementAxis.column,
	                row: newElementAxis.row,
	                id: nextId,
	                componentId: false,
	                props: {}
	            });
	            return { gridTemplate, gridElements };
	        };
	        this.onGridMouseMove = ({ clientX, clientY, gridTemplate }) => {
	            if (!this.dndEvent.currentContainerRect || !this.dndEvent.currentContainer || !this.dndEvent.currentElement)
	                return;
	            //const {col: containerCol, row: containerRow} = this.currentContainer.dataset;
	            const colMax = gridTemplate.columns.length + 1;
	            const rowMax = gridTemplate.rows.length + 1;
	            const colStart = this.dndEvent.currentElement.column.start - 1;
	            const rowStart = this.dndEvent.currentElement.row.start - 1;
	            const colEnd = this.dndEvent.currentElement.column.end;
	            const rowEnd = this.dndEvent.currentElement.row.end;
	            const spread = GridEvents.RESIZE_TRIGGER_DISTANCE;
	            const { left, top, width, height } = this.dndEvent.currentContainerRect;
	            let isHorizontalBorder = false;
	            let isVerticalBorder = false;
	            let isTop = false;
	            let isLeft = false;
	            if (colStart !== 0 && left + spread > clientX) {
	                isHorizontalBorder = true;
	                isLeft = true;
	            }
	            if (colEnd !== colMax && left + width - spread < clientX) {
	                isHorizontalBorder = true;
	            }
	            if (rowStart !== 0 && top + spread > clientY) {
	                isVerticalBorder = true;
	                isTop = true;
	            }
	            if (rowEnd !== rowMax && top + height - spread < clientY) {
	                isVerticalBorder = true;
	            }
	            if (isHorizontalBorder && !isVerticalBorder) {
	                this.dndEvent.currentContainer.style.cursor = "ew-resize";
	            }
	            else if (!isHorizontalBorder && isVerticalBorder) {
	                this.dndEvent.currentContainer.style.cursor = "ns-resize";
	            }
	            else if (isHorizontalBorder && isVerticalBorder) {
	                if (isTop && isLeft || !isTop && !isLeft) {
	                    this.dndEvent.currentContainer.style.cursor = "nwse-resize";
	                }
	                else {
	                    this.dndEvent.currentContainer.style.cursor = "nesw-resize";
	                }
	            }
	            else {
	                this.dndEvent.currentContainer.style.removeProperty("cursor");
	            }
	            //TODO: dont fire that if cursor is not near the border
	            this.setDraggedGridLine(isHorizontalBorder, isVerticalBorder, isTop, isLeft);
	        };
	        this.onCellResize = ({ gridTemplate, clientX, clientY }) => {
	            const { gridHTMLContainer, flexFactor } = this.gridManager.workArea;
	            if (!gridHTMLContainer)
	                return;
	            const { col: colFactor, row: rowFactor } = flexFactor;
	            function updateSize(cells, cellsOrigin, moved, lineNumber) {
	                let gridTemplateStyle = "";
	                const indexA = lineNumber;
	                const indexB = lineNumber + 1;
	                const newValueA = +(cellsOrigin[indexA] + moved).toFixed(3);
	                const newValueB = +(cellsOrigin[indexB] - moved).toFixed(3);
	                if (newValueA > GridEvents.GRID_MIN_SIZE && newValueB > GridEvents.GRID_MIN_SIZE) {
	                    cells[indexA] = +(cellsOrigin[indexA] + moved).toFixed(3);
	                    cells[indexB] = +(cellsOrigin[indexB] - moved).toFixed(3);
	                }
	                for (const cell of cells) {
	                    gridTemplateStyle += cell + "fr ";
	                }
	                return gridTemplateStyle;
	            }
	            if (this.dndEvent.lineHorizontal !== false) {
	                const movedX = (clientX - this.dndEvent.eventOriginPos.clientX) * colFactor;
	                gridHTMLContainer.style.gridTemplateColumns = updateSize(this.dndEvent.columnsClone, gridTemplate.columns, movedX, this.dndEvent.lineHorizontal);
	            }
	            if (this.dndEvent.lineVertical !== false) {
	                const movedY = (clientY - this.dndEvent.eventOriginPos.clientY) * rowFactor;
	                gridHTMLContainer.style.gridTemplateRows = updateSize(this.dndEvent.rowsClone, gridTemplate.rows, movedY, this.dndEvent.lineVertical);
	            }
	        };
	        this.setDraggedGridLine = (isHorizontal, isVertical, isTop, isLeft) => {
	            const { currentElement } = this.dndEvent;
	            if (!currentElement)
	                return;
	            let lineHorizontal = false;
	            let lineVertical = false;
	            if (isHorizontal) {
	                if (isLeft) {
	                    lineHorizontal = currentElement.column.start - 2;
	                }
	                else {
	                    lineHorizontal = currentElement.column.end - 2;
	                }
	            }
	            if (isVertical) {
	                if (isTop) {
	                    lineVertical = currentElement.row.start - 2;
	                }
	                else {
	                    lineVertical = currentElement.row.end - 2;
	                }
	            }
	            this.dndEvent.lineHorizontal = lineHorizontal;
	            this.dndEvent.lineVertical = lineVertical;
	        };
	        this.gridManager = gridManager;
	    }
	    get dndEvent() {
	        return this._dndEvent;
	    }
	}
	/**
	 * Default grid cell size in fr units
	 */
	GridEvents.GRID_FR_SIZE = 1000;
	GridEvents.GRID_MIN_SIZE = GridEvents.GRID_FR_SIZE * .025;
	GridEvents.RESIZE_TRIGGER_DISTANCE = 30;

	class GridFrame extends React.Component {
	    constructor(props) {
	        super(props);
	        this.setContext = () => {
	            this.gridFrameContext = {
	                gridElements: this.state.gridElements,
	                gridTemplate: this.state.gridTemplate,
	                components: this.props.components,
	                joinDirection: this.state.joinDirection,
	                showPanel: this.state.showPanel,
	                config: this.props.config,
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
	        };
	        this.setFrameElements = (newElements) => {
	            this.setState({ gridElements: newElements });
	            this.onUpdateGrid();
	        };
	        this.processGridId = (id, idPrefix) => {
	            if (!id)
	                id = GridFrame.defaultProps.gridId;
	            if (idPrefix)
	                id = idPrefix + id;
	            const MAX_CYCLE = 100;
	            let cycle = 0;
	            function getValidGridId(proposedId) {
	                if (++cycle >= MAX_CYCLE)
	                    return proposedId;
	                if (GridFrame.USED_IDS.includes(proposedId)) {
	                    const matches = proposedId.match(/\d+$/);
	                    if (matches) {
	                        proposedId = proposedId.replace(/\d+$/, "");
	                        proposedId += Number(matches[0]) + 1;
	                    }
	                    else {
	                        proposedId += "2";
	                    }
	                    return getValidGridId(proposedId);
	                }
	                return proposedId;
	            }
	            id = getValidGridId(id);
	            GridFrame.USED_IDS.push(id);
	            return id;
	        };
	        this.setDnDActive = (newStatus) => {
	            this.setState({ dndActive: newStatus });
	        };
	        this.getDndEvent = () => {
	            return this.events.dndEvent;
	        };
	        this.setDndEvent = (newDnDEvent) => {
	            for (const item in newDnDEvent) {
	                if (this.events.dndEvent.hasOwnProperty(item))
	                    this.events.dndEvent[item] = newDnDEvent[item];
	            }
	        };
	        this.getWorkArea = () => {
	            return this.gridManager.workArea;
	        };
	        this.setWorkArea = (newWorkArea) => {
	            for (const item in newWorkArea) {
	                if (this.gridManager.workArea.hasOwnProperty(item))
	                    this.gridManager.workArea[item] = newWorkArea[item];
	            }
	        };
	        this.changeComponentId = (elementId, componentId) => {
	            const gridElements = this.state.gridElements;
	            gridElements.some(element => {
	                if (element.id === elementId) {
	                    element.componentId = componentId;
	                    return true;
	                }
	                return false;
	            });
	            this.setFrameElements(gridElements);
	        };
	        this.renderGrid = () => {
	            const { gridAreaId, defaultComponent, gridIdPrefix } = this.gridManager.workArea;
	            const elements = [];
	            this.events.dndEvent.joinTargetElement = undefined;
	            const components = this.props.components ? Object.assign({}, this.props.components) : {};
	            if (this.props.config && this.props.config.allowSubGrid && !components[GridElement.SUBGRID_ID]) {
	                const props = {
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
	                    template: { columns: [1000], rows: [1000] },
	                    elements: [{
	                            column: { start: 1, end: 2 },
	                            row: { start: 1, end: 2 },
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
	            for (const element of this.state.gridElements) {
	                let component = undefined;
	                if (element.componentId && this.props.components) {
	                    component = this.props.components[element.componentId];
	                }
	                else if (defaultComponent) {
	                    component = defaultComponent.container;
	                }
	                //move this methods to contex api
	                elements.push(React.createElement(GridElement, { key: `${gridIdPrefix}cell-${element.id}`, element: element, component: component }));
	            }
	            return elements;
	        };
	        /**
	         * Sends grid state to hosting component on its change.
	         */
	        this.onUpdateGrid = () => {
	            const { onGridUpdate } = this.props;
	            const { gridElements, gridTemplate } = this.state;
	            onGridUpdate && onGridUpdate({
	                template: gridTemplate,
	                elements: gridElements
	            });
	        };
	        this.onGridMouseUp = (e) => {
	            if (this.events.dndEvent.type === "inactive")
	                return;
	            const { joinDirection, gridElements, gridTemplate } = this.state;
	            const newGridState = this.events.onUpdateGrid({ joinDirection, gridElements, gridTemplate });
	            this.onUpdateGrid();
	            this.clearDNDState(newGridState);
	        };
	        this.clearDNDState = (newState) => {
	            if (!newState)
	                newState = {};
	            this.events.dndEvent.lineHorizontal = false;
	            this.events.dndEvent.lineVertical = false;
	            this.events.dndEvent.joinTargetElement = undefined;
	            this.events.dndEvent.targetOfDraggable = undefined;
	            this.events.dndEvent.madeDNDSnapshot = false;
	            this.events.dndEvent.type = "inactive";
	            if (this.state.dndActive)
	                newState.dndActive = false;
	            if (this.state.joinDirection !== "none")
	                newState.joinDirection = "none";
	            this.setState(newState, () => {
	                if (this.events.dndEvent.currentContainer) {
	                    this.events.dndEvent.currentContainerRect = this.events.dndEvent.currentContainer.getBoundingClientRect();
	                }
	            });
	        };
	        this.onGridMouseDown = (e) => {
	            const { allowGridResize } = this.gridManager.workArea;
	            if (!allowGridResize)
	                return;
	            if (this.events.dndEvent.lineHorizontal !== false || this.events.dndEvent.lineVertical !== false) {
	                const { clientX, clientY, pageX, pageY } = e;
	                this.events.dndEvent.eventOriginPos = {
	                    clientX, clientY, pageX, pageY
	                };
	                this.events.dndEvent.type = "resize";
	                this.gridManager.setContainersActualSizes(this.state.gridTemplate);
	                this.events.dndEvent.columnsClone = this.state.gridTemplate.columns.slice();
	                this.events.dndEvent.rowsClone = this.state.gridTemplate.rows.slice();
	                this.setState({ dndActive: true });
	            }
	        };
	        this.onCellSplit = (direction) => {
	            if (!direction.isSplit || !this.events.dndEvent.currentElement)
	                return;
	            const { gridTemplate, gridElements } = this.events.onCellSplit({
	                direction,
	                gridTemplate: this.state.gridTemplate,
	                gridElements: this.state.gridElements
	            });
	            this.setState({ dndActive: false, gridTemplate, gridElements });
	        };
	        this.setCellJoinDirection = (movedVertical, movedHorizontal) => {
	            let direction = "none";
	            if (Math.abs(movedVertical) > Math.abs(movedHorizontal)) {
	                direction = movedVertical > 0 ? "top" : "bottom";
	            }
	            else {
	                direction = movedHorizontal > 0 ? "left" : "right";
	            }
	            if (this.state.joinDirection !== direction) {
	                this.setState({ joinDirection: direction });
	            }
	        };
	        this.onDNDActiveMove = (e) => {
	            const { pageX, pageY, clientX, clientY } = e;
	            if (this.events.dndEvent.type === "grabber") {
	                const direction = GridUtils.checkSplitDirection(pageX, pageY, this.events.dndEvent.eventOriginPos);
	                this.onCellSplit(direction);
	            }
	            if (this.events.dndEvent.type === "join") {
	                const movedVertical = this.events.dndEvent.eventOriginPos.clientY - clientY;
	                const movedHorizontal = this.events.dndEvent.eventOriginPos.clientX - clientX;
	                this.setCellJoinDirection(movedVertical, movedHorizontal);
	            }
	            if (this.events.dndEvent.type === "resize") {
	                this.events.onCellResize({ clientX, clientY, gridTemplate: this.state.gridTemplate });
	                this.gridManager.checkContainersBreakpoints();
	            }
	        };
	        this.onGridMouseMove = (e) => {
	            const { allowGridResize } = this.gridManager.workArea;
	            if (this.state.dndActive) {
	                this.onDNDActiveMove(e);
	            }
	            else {
	                if (!this.events.dndEvent.currentContainerRect || !this.events.dndEvent.currentContainer || !this.events.dndEvent.currentElement)
	                    return;
	                if (!allowGridResize)
	                    return;
	                if (e.target.dataset.grabber) {
	                    this.events.dndEvent.currentContainer.style.removeProperty("cursor");
	                    this.events.dndEvent.lineHorizontal = false;
	                    this.events.dndEvent.lineVertical = false;
	                    return;
	                }
	                const { clientX, clientY } = e;
	                const { gridTemplate } = this.state;
	                this.events.onGridMouseMove({ clientX, clientY, gridTemplate });
	            }
	        };
	        //TODO: make keybinding configurable
	        this.onKeyUp = (e) => {
	            if (e.keyCode === 73 && e.ctrlKey === true) {
	                this.setState({
	                    showPanel: !this.state.showPanel
	                });
	            }
	            if (e.keyCode === 81 && e.ctrlKey === true) {
	                this.gridManager.workArea.allowGridResize = !this.gridManager.workArea.allowGridResize;
	            }
	        };
	        this.updateGridElementsList = () => {
	            const { gridAreaId, classPrefix, gridHTMLContainer } = this.gridManager.workArea;
	            if (gridHTMLContainer) {
	                const selector = `#${gridAreaId} > .${classPrefix}container`;
	                this.gridManager.workArea.gridHTMLElements = document.querySelectorAll(selector);
	                this.gridManager.checkContainersBreakpoints();
	            }
	        };
	        this.getGridAreaStyle = () => {
	            const gridAreaStyle = this.props.config && this.props.config.customStyling ? {} : Object.assign({}, styleGridArea);
	            const { columns, rows } = this.state.gridTemplate;
	            let gridTemplateColumns = "";
	            let gridTemplateRows = "";
	            for (const col of columns) {
	                gridTemplateColumns += col + "fr ";
	            }
	            for (const row of rows) {
	                gridTemplateRows += row + "fr ";
	            }
	            gridAreaStyle.gridTemplateColumns = gridTemplateColumns;
	            gridAreaStyle.gridTemplateRows = gridTemplateRows;
	            if (this.state.dndActive) {
	                gridAreaStyle.userSelect = "none";
	            }
	            return gridAreaStyle;
	        };
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
	    render() {
	        const { gridAreaClassName, classPrefix, gridAreaId } = this.gridManager.workArea;
	        //TODO: huh? should this be here?
	        this.setContext();
	        const gridContainerStyle = this.getGridAreaStyle();
	        let className = gridAreaClassName;
	        if (this.props.config && this.props.config.isSubGrid) {
	            className += " " + classPrefix + "frame_subgrid";
	        }
	        return (React.createElement(GridContext.Provider, { value: this.gridFrameContext },
	            React.createElement("div", { id: gridAreaId, className: className, style: gridContainerStyle, onMouseDown: this.onGridMouseDown, onMouseUp: this.onGridMouseUp, onMouseMove: this.onGridMouseMove }, this.renderGrid())));
	    }
	    componentDidMount() {
	        const { gridAreaId } = this.gridManager.workArea;
	        this.gridManager.workArea.gridHTMLContainer = document.getElementById(gridAreaId) || undefined;
	        this.gridManager.setContainersActualSizes(this.state.gridTemplate);
	        this.updateGridElementsList();
	        const ro = new ResizeObserver((entries, observer) => {
	            this.gridManager.checkContainersBreakpoints();
	        });
	        this.gridManager.workArea.gridHTMLContainer && ro.observe(this.gridManager.workArea.gridHTMLContainer);
	        document.addEventListener("keyup", this.onKeyUp);
	    }
	    componentDidUpdate() {
	        this.updateGridElementsList();
	    }
	    componentWillUnmount() {
	        const { gridAreaId } = this.gridManager.workArea;
	        document.removeEventListener("keyup", this.onKeyUp);
	        GridFrame.USED_IDS = GridFrame.USED_IDS.filter(id => id !== gridAreaId);
	        //TODO: check that it is deleted correctly
	        GridFrame.EXEMPLARS = GridFrame.EXEMPLARS.filter(instance => instance.id !== gridAreaId);
	    }
	}
	GridFrame.defaultProps = {
	    gridId: "main",
	    template: { columns: [1000], rows: [1000] },
	    elements: [{
	            column: { start: 1, end: 2 },
	            row: { start: 1, end: 2 },
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
	GridFrame.USED_IDS = [];
	GridFrame.EXEMPLARS = [];
	GridFrame.getFrameTemplate = (frameId) => {
	    const targetExemplar = GridFrame.EXEMPLARS.find(exemplar => exemplar.id === frameId);
	    if (targetExemplar) {
	        return targetExemplar.exemplar.state.gridTemplate;
	    }
	    return false;
	};
	GridFrame.getFrameElements = (frameId) => {
	    const targetExemplar = GridFrame.EXEMPLARS.find(exemplar => exemplar.id === frameId);
	    if (targetExemplar) {
	        return targetExemplar.exemplar.state.gridElements;
	    }
	    return false;
	};
	GridFrame.setElementComponent = (areaId, elementId, componentId) => {
	    GridFrame.EXEMPLARS.some(exemplar => {
	        if (exemplar.id === areaId) {
	            const gridAreaExemplar = exemplar.exemplar;
	            const elements = gridAreaExemplar.state.gridElements;
	            elements.some(elem => {
	                if (elem.id === elementId) {
	                    elem.componentId = componentId;
	                    return true;
	                }
	                return false;
	            });
	            gridAreaExemplar.setState({ gridElements: elements });
	            return true;
	        }
	        return false;
	    });
	};

	return GridFrame;

})));
