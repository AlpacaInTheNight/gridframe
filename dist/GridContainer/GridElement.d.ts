import * as React from 'react';
import { TGridElement } from '../index';
interface GridElementProps {
    element: TGridElement;
    component: IGridFrame.gridComponent | undefined;
}
interface GridElementState {
}
export declare class GridElement extends React.Component<GridElementProps, GridElementState> {
    static contextType: React.Context<Partial<IGridFrame.ContextProps>>;
    context: IGridFrame.ContextProps;
    static readonly SUBGRID_ID = "__subgrid";
    static readonly DND_DATATRANSFER_TYPE = "gridframednd";
    private static PREVENT_DND_PROPAGATION;
    constructor(props: GridElementProps);
    /**
     * Resets currentContainer and currentElement if one of them was unset
     * TODO: that is extra load and probably not the best solution,
     * but is used to overcom issue when mouse move from one grid element to another
     * skiping the borders.
     */
    private onGridContainerMove;
    private onGridContainerEnter;
    private onGridContainerLeave;
    private onContainerDrag;
    private onContainerDrop;
    private getCellStyle;
    private getComponentContainer;
    private getAdaptiveObserve;
    private checkJoinStatus;
    private showOverlay;
    private getHTMLId;
    private onDragOver;
    render(): JSX.Element;
}
export {};
