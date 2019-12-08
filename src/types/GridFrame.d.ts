/**
 * 
 */

declare namespace IGridFrame {

	interface gridComponent {
		default?: boolean;
		name?: string;
		body: any;
		props: {[key: string]: any};
		gridProps?: {
			components?: boolean;
			elements?: boolean;
			template?: boolean;
		};
		observe?: {
			adaptive?: adaptiveObserve;
		};
		overflowVisible?: boolean;
	}

	interface componentDefaults {
		props?: {[key: string]: any};
		observe?: {
			adaptive?: adaptiveObserve;
		};
	}

	interface gridConfig {
		componentsDefaults: componentDefaults;
		gridAreaClassName: string;
		classPrefix: string;
		idPrefix: string;
		customStyling: boolean;
		allowSubGrid: boolean;
		isSubGrid: boolean;
		keybinds: gridConfigKeybinds;

		hidePanel: boolean;
		lockGrid: boolean;
	}

	interface gridConfigKeybinds {
		hidePanels: gridConfigKeybind;
		lockGrid: gridConfigKeybind;
	}

	interface gridConfigKeybind {
		keyCode: number,
		ctrl?: boolean,
		alt?: boolean,
		shift?: boolean
	}

	interface gridComponents {
		[key: string]: gridComponent;
	}

	interface gridTemplate {
		columns: number[];
		rows: number[];
	}

	interface gridElementAxis {
		start: number;
		end: number;
	}

	interface gridElement {
		column: gridElementAxis;
		row: gridElementAxis;
		id: number;
		componentId: string | false;
		props: {};
	}

	interface adaptiveObserve {
		breakpoints?: adaptiveBreakpoint[];
		watchOrientation?: boolean;
		defaultBreakpoint?: string;
		resizeTrackStep?: number | false;
	}

	interface viewport {
		width: number;
		height: number;
		pixelRatio: number;
		supportTouch: boolean;
	}

	interface sizeDimensions {
		width?: number;
		height?: number;
	}

	type orientation = "landscape" | "portrait";

	type adaptiveBreakpoint = {
		name: string;
		orientation?: orientation;
		max?: sizeDimensions;
		min?: sizeDimensions;
	};

	type cellActionDirection = "left" | "right" | "bottom" | "top" | "none";

	interface splitDirection {
		isSplit: boolean;
		isHorizontal: boolean
		isVertical: boolean
	}

	interface eventOriginPos {
		clientX: number;
		clientY: number;
		pageX: number;
		pageY: number;
	}

	interface defaultComponent {
		id: string;
		container: gridComponent;
	}

	interface dndTranserData {
		gridId: string;
		elementId: number;
		componentId: string | false;
	}

	interface ContextProps {
		gridElements: IGridFrame.gridElement[];
		gridTemplate: IGridFrame.gridTemplate;
		components: IGridFrame.gridComponents | undefined;
		joinDirection: IGridFrame.cellActionDirection;
		showPanel: boolean;
		config: Partial<IGridFrame.gridConfig>;

		clearDNDState: () => void;
		setElementComponent: (areaId: string, elementId: number, componentId: string | false) => void;
		getDndEvent: () => IGridFrame.dndEvent;
		setDndEvent: (newDnDEvent: Partial<IGridFrame.dndEvent>) => void;
		getWorkArea: () => IGridFrame.workArea;
		setWorkArea: (newWorkArea: Partial<IGridFrame.workArea>) => void;
		setDnDActive: (newStatus: boolean) => void;
		setFrameElements: (newElements: IGridFrame.gridElement[]) => void;
		changeComponentId: (elementId: number, componentId: string | false) => void;
	}
}
