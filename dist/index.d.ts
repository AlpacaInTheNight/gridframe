import * as React from "react";
export interface GridFrameUpdate {
    template: TGridTemplate;
    elements: TGridElement[];
}
interface GridFrameProps {
    gridId: string;
    template: TGridTemplate;
    elements: TGridElement[];
    components: IGridFrame.gridComponents;
    config: Partial<IGridFrame.gridConfig>;
    onGridUpdate?: (update: GridFrameUpdate) => void;
}
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
export interface GridFrameState {
    gridTemplate: TGridTemplate;
    gridElements: TGridElement[];
    dndActive: boolean;
    joinDirection: IGridFrame.cellActionDirection;
    showPanel: boolean;
}
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
    /**
     * Sends grid state to hosting component on its change.
     */
    private onUpdateGrid;
    private onGridMouseUp;
    private clearDNDState;
    private onGridMouseDown;
    private onCellSplit;
    private setCellJoinDirection;
    private onDNDActiveMove;
    private onGridMouseMove;
    private onKeyUp;
    private updateGridElementsList;
    private getGridAreaStyle;
}
export {};
