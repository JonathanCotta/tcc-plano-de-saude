import React from 'react';
import PropTypes from 'prop-types';

// third-party
import SyntaxHighlighter from 'react-syntax-highlighter';
import Prism from 'react-syntax-highlighter/dist/cjs/prism';

// ==============================|| CODE HIGHLIGHTER ||============================== //

export default function SyntaxHighlight({ children, ...others }) {
    return (
        <SyntaxHighlighter language="javacript" showLineNumbers style={Prism} {...others}>
            {children}
        </SyntaxHighlighter>
    );
}

SyntaxHighlight.propTypes = {
    children: PropTypes.node
};
