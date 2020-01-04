import { TGridTemplate, TGridElement, TEventOriginPos, TCellActionDirection, TSplitDirection } from '../index';
export declare class GridUtils {
    private static readonly DND_TRIGGER_DISTANCE;
    static isTargedOfJoining: (element: TGridElement, currentElement: TGridElement, direction: TCellActionDirection) => boolean;
    static canJointSplit: (gridElement: TGridElement, currentElement: TGridElement, direction: TCellActionDirection) => boolean;
    static joinIsPossible: (joinTargetElement: TGridElement, currentElement: TGridElement, direction: TCellActionDirection) => boolean;
    static checkSplitDirection: (pageX: number, pageY: number, eventOriginPos: TEventOriginPos) => TSplitDirection;
    static normalizeGrid: (gridElements: TGridElement[], gridTemplate: TGridTemplate, gridFRSize: number) => TGridTemplate;
}
