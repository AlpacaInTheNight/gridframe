import * as React from "react";
import { TWorkArea } from './GridManager';
import { DNDEvent } from './events/grid';
export interface GridFrameUpdate {
    template: TGridTemplate;
    elements: TGridElement[];
}
export declare type GridFrameProps = {
    gridId: string;
    template: TGridTemplate;
    elements: TGridElement[];
    components: TGridComponents;
    config: Partial<TGridConfig>;
    onGridUpdate?: (update: GridFrameUpdate) => void;
};
export declare type GridFrameState = {
    gridTemplate: TGridTemplate;
    gridElements: TGridElement[];
    dndActive: boolean;
    joinDirection: TCellActionDirection;
    showPanel: boolean;
};
export declare type TComponentDefaults = {
    props?: {
        [key: string]: any;
    };
    observe?: {
        adaptive?: TAdaptiveObserve;
    };
};
export declare type TGridConfigKeybinds = {
    hidePanels: TGridConfigKeybind;
    lockGrid: TGridConfigKeybind;
};
export declare type TGridConfigKeybind = {
    keyCode: number;
    ctrl?: boolean;
    alt?: boolean;
    shift?: boolean;
};
export declare type TGridComponents = {
    [key: string]: TGridComponent;
};
export declare type TContextProps = {
    gridElements: TGridElement[];
    gridTemplate: TGridTemplate;
    components: TGridComponents | undefined;
    joinDirection: TCellActionDirection;
    showPanel: boolean;
    config: Partial<TGridConfig>;
    clearDNDState: () => void;
    setElementComponent: (areaId: string, elementId: number, componentId: string | false) => void;
    getDndEvent: () => DNDEvent;
    setDndEvent: (newDnDEvent: Partial<DNDEvent>) => void;
    getWorkArea: () => TWorkArea;
    setWorkArea: (newWorkArea: Partial<TWorkArea>) => void;
    setDnDActive: (newStatus: boolean) => void;
    setFrameElements: (newElements: TGridElement[]) => void;
    changeComponentId: (elementId: number, componentId: string | false) => void;
};
export declare type TGridComponent = {
    default?: boolean;
    name?: string;
    body: any;
    props: {
        [key: string]: any;
    };
    gridProps?: {
        components?: boolean;
        elements?: boolean;
        template?: boolean;
    };
    observe?: {
        adaptive?: TAdaptiveObserve;
    };
    overflowVisible?: boolean;
};
export declare type TAdaptiveObserve = {
    breakpoints?: TAdaptiveBreakpoint[];
    watchOrientation?: boolean;
    defaultBreakpoint?: string;
    resizeTrackStep?: number | false;
};
export declare type TSizeDimensions = {
    width?: number;
    height?: number;
};
export declare type TOrientation = "landscape" | "portrait";
export declare type TAdaptiveBreakpoint = {
    name: string;
    orientation?: TOrientation;
    max?: TSizeDimensions;
    min?: TSizeDimensions;
};
export declare type TCellActionDirection = "left" | "right" | "bottom" | "top" | "none";
export declare type TSplitDirection = {
    isSplit: boolean;
    isHorizontal: boolean;
    isVertical: boolean;
};
export declare type TEventOriginPos = {
    clientX: number;
    clientY: number;
    pageX: number;
    pageY: number;
};
export declare type TDefaultComponent = {
    id: string;
    container: TGridComponent;
};
export declare type TGridConfig = {
    componentsDefaults: TComponentDefaults;
    gridAreaClassName: string;
    classPrefix: string;
    idPrefix: string;
    customStyling: boolean;
    allowSubGrid: boolean;
    isSubGrid: boolean;
    keybinds: TGridConfigKeybinds;
    hidePanel: boolean;
    lockGrid: boolean;
};
export declare type TGridTemplate = {
    columns: number[];
    rows: number[];
};
export declare type TGridElementAxis = {
    start: number;
    end: number;
};
export declare type TGridElement = {
    column: TGridElementAxis;
    row: TGridElementAxis;
    id: number;
    componentId: string | false;
    props: {};
};
export default class GridFrame extends React.Component<Partial<GridFrameProps>, GridFrameState> {
    private static defaultProps;
    /**
     * Array of the used ids. Used to make sure that no grid areas with the same ids would be created.
     */
    private static USED_IDS;
    private static EXEMPLARS;
    private gridFrameContext;
    private events;
    private gridManager;
    constructor(props: GridFrameProps);
    static getFrameTemplate: (frameId: string) => false | TGridTemplate;
    static getFrameElements: (frameId: string) => false | TGridElement[];
    private static setElementComponent;
    /**
     * Sends grid state to hosting component on its change.
     */
    gridUpdateCallback: () => void;
    render(): JSX.Element;
    componentDidMount(): void;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    private setContext;
    private setFrameElements;
    private processGridId;
    private setDnDActive;
    private getDndEvent;
    private setDndEvent;
    private getWorkArea;
    private setWorkArea;
    private changeComponentId;
    private renderGrid;
    private onCellSplit;
    private setCellJoinDirection;
    private onDNDActiveMove;
    private onGridMouseMove;
    private onKeyUp;
    private updateGridElementsList;
    private getGridAreaStyle;
}
