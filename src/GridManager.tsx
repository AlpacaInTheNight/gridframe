import GridFrame from './index';

type Props = {
	components: IGridFrame.gridComponents;
	config: Partial<IGridFrame.gridConfig>;
};

export default class GridManager {

	private static readonly DEFAULT_GRID_ID_PREFIX = "grid-";

	private _workArea: IGridFrame.workArea = {
		gridAreaId: "",
		gridAreaClassName: "",
		classPrefix: "",
		gridHTMLElements: undefined,
		gridHTMLContainer: undefined,
		defaultComponent: false,
		defaultAdaptiveObserve: {},
		gridIdPrefix: GridManager.DEFAULT_GRID_ID_PREFIX,
		flexFactor: {
			col: 1,
			row: 1
		},
		allowGridResize: true,
	};

	public constructor(props: Props) {
		const {config, components} = props;

		for(const componentId in components) {
			if(components[componentId].default) {
				this.workArea.defaultComponent = {
					id: componentId,
					container: components[componentId]
				};
				break;
			}
		}

		if(config) {
			if(config.idPrefix) {
				this.workArea.gridIdPrefix = config.idPrefix;
			}

			if(config.classPrefix) {
				this.workArea.classPrefix = config.classPrefix;
			}

			if(config.componentsDefaults && config.componentsDefaults.observe && config.componentsDefaults.observe.adaptive) {
				this.workArea.defaultAdaptiveObserve = config.componentsDefaults.observe.adaptive;
			}

			if(config.lockGrid) {
				this.workArea.allowGridResize = false;
			}
		}

		if(config && config.gridAreaClassName) {
			this.workArea.gridAreaClassName = config.gridAreaClassName;
		} else {
			this.workArea.gridAreaClassName = this.workArea.classPrefix + "gridArea";
		}
	}

	get workArea() {
		return this._workArea;
	}

	public checkContainersBreakpoints = () => {
		const {gridHTMLElements} = this.workArea;

		gridHTMLElements && gridHTMLElements.forEach( (container: HTMLElement) => {
			if(container.offsetWidth <= 210) {
				if(!container.classList.contains("slim")) {
					container.classList.add("slim");
				}
			} else if(container.classList.contains("slim")) {
				container.classList.remove("slim");
			}

			container.dataset.width = container.offsetWidth.toString();
			container.dataset.height = container.offsetHeight.toString();
		});
	}
}
