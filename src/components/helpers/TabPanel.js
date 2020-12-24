
const TabPanel = props => {
    const { tabValue, tabIndex, ...otherProps } = props;
    
    return (
        <div role="tabpanel" hidden={tabValue !== tabIndex} {...otherProps}>
            {props.children}
        </div>
    );
};

export default TabPanel;