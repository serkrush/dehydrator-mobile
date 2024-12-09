import React from 'react';
import {View, ActivityIndicator, StyleSheet, Text} from 'react-native';
import {connect} from 'react-redux';

interface IHOCProps {
    requestResult: Map<string, any>;
}

export const withRequestResult = <P extends object>(
    WrappedComponent: React.ComponentType<P>,
    options: any = {},
) => {
    class WithRequestHOC extends React.Component<P & IHOCProps> {
        private checkFetch = () => {
            let fetching = false;

            if ('entityName' in options) {
                const result =
                    this.props.requestResult &&
                    this.props.requestResult.has(options['entityName']) &&
                    this.props.requestResult.get(options['entityName']);

                if (result && result.has('fetching')) {
                    fetching = result.get('fetching');
                }
            } else if ('pager' in options) {
                const pager = options['pager'];
                if (pager && typeof pager.has === 'function') {
                    fetching = pager.has('fetching') && pager.get('fetching');
                }
            }

            return fetching;
        };

        public render() {
            return (
                <View style={styles.container}>
                    <ActivityIndicator
                        size="large"
                        color="#6b7280"
                        animating={this.checkFetch()}
                        style={styles.preloader}
                    />
                    <WrappedComponent {...(this.props as P)} />
                </View>
            );
        }
    }

    const mapStateToProps = (state: any) => {
        const {requestResult} = state;
        return {requestResult};
    };

    return connect(mapStateToProps)(WithRequestHOC);
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },
    preloader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

// import React from 'react';
// import has from 'lodash/has';
// import get from 'lodash/get';
// import {connect} from 'react-redux';
// import Preloader from '../FaIcons/preloader';
// // import Preloader from 'src/components/FaIcons/preloader';

// interface IHOCProps {
//     requestResult: Map<string, any>;
// }

// export const withRequestResult = <P extends any>(
//     WrappedComponent: React.ComponentType<P>,
//     options = {} as any,
//     className = '' as string,
// ) => {
//     class WithRequestHOC extends React.Component<P & IHOCProps> {
//         private checkFetch = () => {
//             let fetching = false;
//             if ('entityName' in options) {
//                 const result =
//                     this.props.requestResult &&
//                     has(this.props.requestResult, options['entityName']) &&
//                     get(this.props.requestResult, options['entityName']);
//                 if (result && has(result, 'fetching')) {
//                     fetching = get(result, 'fetching');
//                 }
//             } else if ('pager' in options) {
//                 fetching =
//                     options['pager'] &&
//                     has(options['pager'], 'fetching') &&
//                     get(options['pager'], 'fetching');
//             }
//             return fetching;
//         };

//         public render() {
//             return (
//                 <div className={`relative ${className}`}>
//                     <Preloader
//                         wrapperClassName="w-full h-full"
//                         active={this.checkFetch()}
//                         color="#6b7280"
//                         parentBackGroundShadow={true}
//                         size="48px"
//                     />
//                     {/* @ts-ignore */}
//                     <WrappedComponent {...this.props} />
//                 </div>
//             );
//         }
//     }

//     const mapStateToProps = (state: any) => {
//         const {requestResult} = state;
//         return {requestResult};
//     };
//     // @ts-ignore
//     return connect(mapStateToProps, {})(WithRequestHOC);
// };
