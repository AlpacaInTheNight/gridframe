import { TGridTemplate, TGridElement } from '../index';
export declare class GridUtils {
    private static readonly DND_TRIGGER_DISTANCE;
    static isTargedOfJoining: (element: TGridElement, currentElement: TGridElement | undefined, direction: IGridFrame.cellActionDirection) => boolean;
    static canJointSplit: (gridElement: TGridElement, currentElement: TGridElement | undefined, direction: IGridFrame.cellActionDirection) => boolean;
    static joinIsPossible: (joinTargetElement: TGridElement, currentElement: TGridElement | undefined, direction: IGridFrame.cellActionDirection) => boolean;
    static checkSplitDirection: (pageX: number, pageY: number, eventOriginPos: IGridFrame.eventOriginPos) => IGridFrame.splitDirection;
    /**
     * Removes not used grid columns or rows
     */
    static normalizeGrid: (gridElements: TGridElement[], gridTemplate: TGridTemplate, gridFRSize: number) => TGridTemplate;
}
