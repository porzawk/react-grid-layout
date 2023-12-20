import { FunctionComponent, useState, useEffect } from "react";
import _ from "lodash";
import ReactGridLayout, { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

interface Props {
  className?: string;
  rowHeight?: number;
  onLayoutChange?: (
    layout: ReactGridLayout.Layout[],
    layouts: ReactGridLayout.Layouts
  ) => void;
  containerPadding?: number[];
}

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const App: FunctionComponent<Props> = (props) => {
  const [layouts, setLayouts] = useState<{
    [index: string]: ReactGridLayout.Layout[];
  }>({
    lg: _.map(_.range(0, 25), function (item, i) {
      const y = Math.ceil(Math.random() * 4) + 1;
      return {
        x: (_.random(0, 5) * 1) % 12,
        y: Math.floor(i / 6) * y,
        w: 1,
        h: y,
        i: i.toString(),
        resizeHandles: ["se"],
      };
    }),
  });
  const [currentBreakpoint, setCurrentBreakpoint] = useState<string>("lg");
  const [mounted, setMounted] = useState(false);
  const [toolbox, setToolbox] = useState<{ [index: string]: string[] }>({
    lg: [],
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const onBreakpointChange = (breakpoint: string) => {
    setCurrentBreakpoint(breakpoint);
    setToolbox({
      ...toolbox,
      [breakpoint]: toolbox[breakpoint] || toolbox[currentBreakpoint] || [],
    });
  };

  const onLayoutChange = (
    layout: ReactGridLayout.Layout[],
    layouts: ReactGridLayout.Layouts
  ) => {
    setLayouts({ ...layouts });
  };

  const onDrop = (
    layout: ReactGridLayout.Layout[],
    layoutItem: ReactGridLayout.Layout
  ) => {
    alert(
      `Element parameters:\n${JSON.stringify(
        layoutItem,
        ["x", "y", "w", "h"],
        2
      )}`
    );
  };

  const generateDOM = () => {
    return _.map(layouts.lg, function (l, i) {
      return (
        <div
          key={i}
          style={{ background: "#ccc" }}
          className={l.static ? "static" : ""}
        >
          {l.static ? (
            <span
              className="text"
              title="This item is static and cannot be removed or resized."
            >
              Static - {i}
            </span>
          ) : (
            <span className="text">{i}</span>
          )}
        </div>
      );
    });
  };

  return (
    <div className="w-screen px-10">
      <div
        className="droppable-element"
        draggable
        unselectable="on"
        onDragStart={(e) => e.dataTransfer.setData("text/plain", "")}
      >
        Droppable Element (Drag me!)
      </div>

      <div className="mb-4 w-full">
        <ResponsiveReactGridLayout
          {...props}
          style={{ background: "#f0f0f0" }}
          layouts={layouts}
          measureBeforeMount={false}
          useCSSTransforms={mounted}
          containerPadding={[1, 1]}
          compactType="vertical"
          preventCollision={false}
          onLayoutChange={onLayoutChange}
          onBreakpointChange={onBreakpointChange}
          onDrop={onDrop}
          isDroppable
        >
          {generateDOM()}
        </ResponsiveReactGridLayout>
      </div>
    </div>
  );
};

export default App;
