import GridManager from '../GridManager';
import { TGridTemplate, TGridElement, TEventOriginPos, TCellActionDirection, TSplitDirection } from '../index';
export declare type DNDEvent = {
    type: "inactive" | "grabber" | "resize" | "join" | "swap";
    eventOriginPos: TEventOriginPos;
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
    private static readonly GRID_FR_SIZE;
    private static readonly GRID_MIN_SIZE;
    private static readonly RESIZE_TRIGGER_DISTANCE;
    private gridManager;
    private _dndEvent;
    constructor(gridManager: GridManager);
    get dndEvent(): DNDEvent;
    setDndEvent: (newDnDEvent: Partial<DNDEvent>) => void;
    onUpdateGrid: ({ gridTemplate, gridElements, joinDirection }: {
        gridTemplate: TGridTemplate;
        gridElements: TGridElement[];
        joinDirection: TCellActionDirection;
    }) => false | {
        gridTemplate: TGridTemplate;
        gridElements: TGridElement[];
    };
    onCellSplit: ({ direction, gridTemplate, gridElements }: {
        direction: TSplitDirection;
        gridTemplate: TGridTemplate;
        gridElements: TGridElement[];
    }) => {
        gridTemplate: TGridTemplate;
        gridElements: TGridElement[];
    };
    onGridMouseMove: ({ clientX, clientY, gridTemplate }: {
        gridTemplate: TGridTemplate;
        clientX: number;
        clientY: number;
    }) => void;
    onCellResize: ({ gridTemplate, clientX, clientY }: {
        gridTemplate: TGridTemplate;
        clientX: number;
        clientY: number;
    }) => void;
    private setDraggedGridLine;
}
