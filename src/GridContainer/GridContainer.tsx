import * as React from "react";
import { TAdaptiveObserve, TOrientation, TAdaptiveBreakpoint } from '../index';

type Props = {
	body: any;
	props: {[key: string]: any};
	containerId: number;
	htmlContainerId: string;
	changeComponentId: (elementId: number, componentId: string) => void;
	adaptiveObserve: TAdaptiveObserve;
};

type State = {
	width: number;
	height: number;
	breakpointName: string | false;
	orientation: TOrientation | false;
};

export class GridContainer extends React.Component<Props, State> {
	
	private observer: MutationObserver | undefined;
	private target: HTMLElement | null | undefined;
	
	constructor(props: Props) {
		super(props);

		const state: State = {
			width: 0,
			height: 0,
			breakpointName: false,
			orientation: false
		};

		this.state = state;
	}

	public render() {
		const {body: CONTAINER, changeComponentId, containerId} = this.props;
		const {userProps} = this.props.props;

		return (
			<CONTAINER
				width={this.state.width}
				height={this.state.height}
				breakpoint={this.state.breakpointName}
				orientation={this.state.orientation}
				changeComponentId={changeComponentId}
				containerId={containerId}
				{...userProps}
			/>
		);
	}

	public shouldComponentUpdate(nextProps: Props, nextState: State) {

		//TODO: check if resizeObserver did change
		this.observer && this.observer.disconnect();
		this.addObserver();

		if(this.props.body !== nextProps.body) return true;
		
		for (const index in nextState) {
			if (nextState[index] !== this.state[index]) {
				return true;
			}
		}
		
		//TODO: add recursive check
		for (const index in nextProps) {
			if (nextProps[index] !== this.props[index]) {
				return true;
			}
		}
		
		return false;
	}

	public componentDidUpdate() {
		this.processResize();
	}

	public componentDidMount() {
		this.addObserver();
	}

	public componentWillUnmount() {
		this.observer && this.observer.disconnect();
	}

	private processResize = () => {
		const {resizeTrackStep, breakpoints: watchBreakpoints, watchOrientation} = this.props.adaptiveObserve;
		const target = this.target;
		if(!target) return;

		//TODO: replace this with default props
		const responsiveStep: number | false = resizeTrackStep ? resizeTrackStep : false;
		const breakpoints: TAdaptiveBreakpoint[] | false = watchBreakpoints ? watchBreakpoints : false;
		let orientation: TOrientation | false = false;

		const newState: Partial<State> = {};
		let width: number = Number(target.dataset.width);
		let height: number = Number(target.dataset.height);

		if(watchOrientation) {
			if(width <= height) {
				orientation = "landscape";
			} else if(width > height) {
				orientation = "portrait";
			}

			newState.orientation = orientation;
		}

		if(responsiveStep) {
			if(Number.isInteger(width)) {
				width = Math.floor(width / responsiveStep) * responsiveStep;

				if(this.state.width !== width) {
					newState.width = width;
				}
			}

			if(Number.isInteger(height)) {
				height = Math.floor(height / responsiveStep) * responsiveStep;

				if(this.state.height !== height) {
					newState.height = height;
				}
			}
		} else {
			if(this.state.width !== 0) newState.width = 0;
			if(this.state.height !== 0) newState.height = 0;
		}
		
		if(breakpoints) {
			breakpoints.some( breakpoint => {
				let fulfill: boolean = true;

				if(breakpoint.orientation) {
					if(breakpoint.orientation === "landscape" && width < height) {
						fulfill = false;
					}

					if(breakpoint.orientation === "portrait" && width > height) {
						fulfill = false;
					}
				}

				if(breakpoint.min && fulfill) {
					if(breakpoint.min.width && (width < breakpoint.min.width) ) {
						fulfill = false;
					}

					if(breakpoint.min.height && (height < breakpoint.min.height) ) {
						fulfill = false;
					}
				}

				if(breakpoint.max && fulfill) {
					if(breakpoint.max.width && (width > breakpoint.max.width) ) {
						fulfill = false;
					}

					if(breakpoint.max.height && (height > breakpoint.max.height) ) {
						fulfill = false;
					}
				}

				if(fulfill) {
					if(this.state.breakpointName !== breakpoint.name) {
						newState.breakpointName = breakpoint.name;
					}
				}
				return fulfill;
			});
		} else if(newState.breakpointName !== "") {
			newState.breakpointName = "";
		}

		if(newState.width !== undefined || newState.height !== undefined || newState.breakpointName !== undefined) {
			this.setState(newState as State);
		}
	}

	private addObserver = () => {
		if(!this.props.adaptiveObserve) return;
		const {resizeTrackStep, breakpoints: watchBreakpoints, watchOrientation} = this.props.adaptiveObserve;

		//TODO: replace this with ref in render
		const target = document.getElementById(this.props.htmlContainerId);
		this.target = target;
		if(!target) return;
		
		const responsiveStep: number | false = resizeTrackStep ? resizeTrackStep : false;
		const breakpoints: TAdaptiveBreakpoint[] | false = watchBreakpoints ? watchBreakpoints : false;

		if(responsiveStep || breakpoints || watchOrientation) {
			this.observer = new MutationObserver( mutations => mutations.forEach( mutation => {
				if(mutation.attributeName === "data-width" || mutation.attributeName === "data-height") {
					this.processResize();
				}
			}));
			
			const config = { attributes: true, attributeOldValue: true, childList: false, characterData: false };
			this.observer.observe(target, config);
		}
	}
}
