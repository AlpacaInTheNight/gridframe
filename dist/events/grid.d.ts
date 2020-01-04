import * as React from "react";
import GridManager from '../GridManager';
import GridFrame, { GridFrameState, TGridTemplate, TGridElement, TEventOriginPos, TCellActionDirection, TSplitDirection } from '../index';
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
    private static readonly GRID_FR_SIZE;
    private static readonly GRID_MIN_SIZE;
    private static readonly RESIZE_TRIGGER_DISTANCE;
    private core;
    private gridManager;
    private _dndEvent;
    constructor(gridFrame: GridFrame, gridManager: GridManager);
    get dndEvent(): DNDEvent;
    setDndEvent: (newDnDEvent: Partial<DNDEvent>) => void;
    clearDNDState: (newState?: false | Partial<GridFrameState>) => void;
    onGridMouseUp: (e: React.MouseEvent<Element, MouseEvent>) => void;
    onUpdateGrid: ({ gridTemplate, gridElements, joinDirection }: {
        gridTemplate: TGridTemplate;
        gridElements: TGridElement[];
        joinDirection: TCellActionDirection;
    }) => false | {
        gridTemplate: TGridTemplate;
        gridElements: TGridElement[];
    };
    onGridMouseDown: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    onGridMouseMove: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    onCellSplit: ({ direction, gridTemplate, gridElements }: {
        direction: TSplitDirection;
        gridTemplate: TGridTemplate;
        gridElements: TGridElement[];
    }) => {
        gridTemplate: TGridTemplate;
        gridElements: TGridElement[];
    };
    processMouseMove: ({ clientX, clientY, gridTemplate }: {
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
