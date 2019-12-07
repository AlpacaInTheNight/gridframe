import * as React from "react";
export interface GridFrameUpdate {
    template: IGridFrame.gridTemplate;
    elements: IGridFrame.gridElement[];
}
interface GridFrameProps {
    gridId: string;
    template: IGridFrame.gridTemplate;
    elements: IGridFrame.gridElement[];
    components: IGridFrame.gridComponents;
    config: Partial<IGridFrame.gridConfig>;
    onGridUpdate?: (update: GridFrameUpdate) => void;
}
export interface GridFrameState {
    gridTemplate: IGridFrame.gridTemplate;
    gridElements: IGridFrame.gridElement[];
    dndActive: boolean;
    joinDirection: IGridFrame.cellActionDirection;
    showPanel: boolean;
}
export default class GridFrame extends React.Component<Partial<GridFrameProps>, GridFrameState> {
    /**
     * Default grid cell size in fr units
     */
    private static readonly GRID_FR_SIZE;
    private static readonly GRID_MIN_SIZE;
    private static readonly RESIZE_TRIGGER_DISTANCE;
    private static readonly DEFAULT_GRID_ID_PREFIX;
    private static defaultProps;
    /**
     * Array of the used ids. Used to make sure that no grid areas with the same ids would be created.
     */
    private static USED_IDS;
    private static EXEMPLARS;
    private gridFrameContext;
    private events;
    private workArea;
    constructor(props: GridFrameProps);
    static getFrameTemplate: (frameId: string) => false | IGridFrame.gridTemplate;
    static getFrameElements: (frameId: string) => false | IGridFrame.gridElement[];
    private static setElementComponent;
    /**
     * in pixels
     */
    render(): JSX.Element;
    UNSAFE_componentWillUpdate(newProps: GridFrameProps, newState: GridFrameState): void;
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
    /**
     * Sends grid state to hosting component on its change.
     */
    private onUpdateGrid;
    private onGridMouseUp;
    private clearDNDState;
    private checkContainersBreakpoints;
    private setContainersActualSizes;
    private onGridMouseDown;
    private onCellSplit;
    private setCellJoinDirection;
    private onCellResize;
    private onDNDActiveMove;
    private onGridMouseMove;
    private setDraggedGridLine;
    private onKeyUp;
    private updateGridElementsList;
    private getGridAreaStyle;
}
export {};
