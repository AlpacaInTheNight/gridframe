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
    static getFrameTemplate: (frameId: string) => false | IGridFrame.gridTemplate;
    static getFrameElements: (frameId: string) => false | IGridFrame.gridElement[];
    private static setElementComponent;
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
