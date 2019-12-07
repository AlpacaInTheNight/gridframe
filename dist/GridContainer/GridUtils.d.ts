export declare class GridUtils {
    private static readonly DND_TRIGGER_DISTANCE;
    static isTargedOfJoining: (element: IGridFrame.gridElement, currentElement: IGridFrame.gridElement | undefined, direction: IGridFrame.cellActionDirection) => boolean;
    static canJointSplit: (gridElement: IGridFrame.gridElement, currentElement: IGridFrame.gridElement | undefined, direction: IGridFrame.cellActionDirection) => boolean;
    static joinIsPossible: (joinTargetElement: IGridFrame.gridElement, currentElement: IGridFrame.gridElement | undefined, direction: IGridFrame.cellActionDirection) => boolean;
    static checkSplitDirection: (pageX: number, pageY: number, eventOriginPos: IGridFrame.eventOriginPos) => IGridFrame.splitDirection;
    /**
     * Removes not used grid columns or rows
     */
    static normalizeGrid: (gridElements: IGridFrame.gridElement[], gridTemplate: IGridFrame.gridTemplate, gridFRSize: number) => IGridFrame.gridTemplate;
}
