import * as React from 'react';
import { TGridElement, TGridComponent, TContextProps } from '../index';
interface GridElementProps {
    element: TGridElement;
    component: TGridComponent | undefined;
}
interface GridElementState {
}
export declare class GridElement extends React.Component<GridElementProps, GridElementState> {
    static contextType: React.Context<Partial<TContextProps>>;
    static readonly SUBGRID_ID = "__subgrid";
    static readonly DND_DATATRANSFER_TYPE = "gridframednd";
    private static preventDNDPropagation;
    context: TContextProps;
    constructor(props: GridElementProps);
    render(): JSX.Element;
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
}
export {};
