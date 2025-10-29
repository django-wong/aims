import React from 'react';

export default function AppLogoIcon(props: React.ComponentProps<'img'>) {
    return (
        <img {...props} src={'/logo.png'}/>
    );
}
