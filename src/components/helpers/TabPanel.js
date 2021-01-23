
const TabPanel = ({ tabValue, tabIndex, children, ...otherProps }) => (
    <div role='tabpanel' hidden={tabValue !== tabIndex} {...otherProps}>
        {children}
    </div>
);

export default TabPanel;