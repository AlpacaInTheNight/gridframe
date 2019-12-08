import GridManager from '../GridManager';
export declare type DNDEvent = {
    type: "inactive" | "grabber" | "resize" | "join" | "swap";
    eventOriginPos: IGridFrame.eventOriginPos;
    lineHorizontal: number | false;
    lineVertical: number | false;
    columnsClone: number[];
    rowsClone: number[];
    currentContainerRect: DOMRect | ClientRect | undefined;
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
    private static readonly GRID_FR_SIZE;
    private static readonly GRID_MIN_SIZE;
    private static readonly RESIZE_TRIGGER_DISTANCE;
    private gridManager;
    private _dndEvent;
    constructor(gridManager: GridManager);
    get dndEvent(): DNDEvent;
    setDndEvent: (newDnDEvent: Partial<DNDEvent>) => void;
    onUpdateGrid: ({ gridTemplate, gridElements, joinDirection }: {
        gridTemplate: IGridFrame.gridTemplate;
        gridElements: IGridFrame.gridElement[];
        joinDirection: IGridFrame.cellActionDirection;
    }) => false | {
        gridTemplate: IGridFrame.gridTemplate;
        gridElements: IGridFrame.gridElement[];
    };
    onCellSplit: ({ direction, gridTemplate, gridElements }: {
        direction: IGridFrame.splitDirection;
        gridTemplate: IGridFrame.gridTemplate;
        gridElements: IGridFrame.gridElement[];
    }) => {
        gridTemplate: IGridFrame.gridTemplate;
        gridElements: IGridFrame.gridElement[];
    };
    onGridMouseMove: ({ clientX, clientY, gridTemplate }: {
        gridTemplate: IGridFrame.gridTemplate;
        clientX: number;
        clientY: number;
    }) => void;
    onCellResize: ({ gridTemplate, clientX, clientY }: {
        gridTemplate: IGridFrame.gridTemplate;
        clientX: number;
        clientY: number;
    }) => void;
    private setDraggedGridLine;
}
