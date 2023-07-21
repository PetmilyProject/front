// import { StyleSheet, Text, TextInput, View } from 'react-native';
// import PropTypes from 'prop-types';
// import { forwardRef, useState } from 'react';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import { BLACK } from '../colors';
// import { GRAY, PRIMARY } from '../colors';

// export const ReturnKeyTypes2 = {
//     DONE: 'done',
//     NEXT: 'next',
// };

// const InputTypeProps2 = {
//     NAME: {
//         title: '이름',
//         placeholder: '이름',
//         keyboardType: 'default',
//         secureTextEntry: false,
//     },
//     AGE: {
//         title: '나이',
//         placeholder: '나이',
//         keyboardType: 'numeric',
//         secureTextEntry: false,
//     },
//     INFO: {
//         title: '상세 정보',
//         placeholder: '상세 정보 입력',
//         keyboardType: 'default',
//         secureTextEntry: false,
//     }
// };

// export const InputTypes2 = {
//     NAME: 'NAME',
//     AGE: 'AGE',
//     INFO: 'INFO',
// };

// const Input2 = forwardRef(({ inputType2, styles, ...props }, ref) => {
//     const {
//         title,
//         placeholder,
//         keyboardType,
//         secureTextEntry,
//     } = InputTypeProps2[inputType2];

//     const { value } = props;

//     const [isFocused, setIsFocused] = useState(false);

//     return (
//         <View style={[defaultStyles.container, styles?.container]}>
//             <View style={{flexDirection: 'row', flexWrap: 'nowrap'}}>
//                 <Text style={[
//                     defaultStyles.title,
//                     { 
//                         // 이 곳에 일반적인 스타일들이 들어감
//                         flex: 1,
//                         marginTop: '3%',
//                         color: value || isFocused ? PRIMARY.DEFAULT : GRAY.DARK,
//                         alignContent: 'center',
//                         justifyContent: 'center',
//                     },
//                     styles?.title,
//                     ]}
//                 >
//                     {title}&nbsp;:&nbsp;
//                 </Text>
//                 <TextInput
//                     ref={ref}
//                     {...props}
//                     placeholder={placeholder}
//                     keyboardType={keyboardType}
//                     secureTextEntry={secureTextEntry}
//                     onFocus={() => setIsFocused(true)}
//                     onBlur={() => setIsFocused(false)}
//                     style={[
//                         defaultStyles.input,
//                         {
//                             borderColor: value || isFocused ? PRIMARY.DEFAULT : GRAY.DARK,
//                             color: value || isFocused ? PRIMARY.DEFAULT : GRAY.DARK,
//                             width: '80%',
//                             alignItems: 'flex-end'
//                         },
//                         styles?.input,
//                     ]}
//                     textContentType="none"
//                     autoCapitalize="none"
//                     autoCorrect={false}
//                 />
//             </View>
//         </View>
//     );
// });

// Input2.displayName = 'Input2';

// Input2.propTypes = {
//     inputType2: PropTypes.oneOf(Object.values(InputTypes2)).isRequired,
//     value: PropTypes.string.isRequired,
//     styles: PropTypes.object,
// };

// const defaultStyles = StyleSheet.create({
//     container: {
//         width: '100%',
//     },
//     title: {
//         marginBottom: 4,
//         fontWeight: '700',
//     },
//     input: {
//         borderBottomWidth: 1,
//         borderRadius: 8,
//         height: 42,
//         paddingHorizontal: 10,
//         paddingLeft: 40,
//     },
//     icon: {
//         position: 'absolute',
//         left: 8,
//         height: '100%',
//         justifyContent: 'center',
//     },
// });

// export default Input2;

import { StyleSheet, Text, TextInput, View } from 'react-native';
import PropTypes from 'prop-types';
import { forwardRef, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BLACK } from '../colors';
import { GRAY, PRIMARY } from '../colors';

export const ReturnKeyTypes2 = {
    DONE: 'done',
    NEXT: 'next',
};

const InputTypeProps2 = {
    NAME: {
        title: '이름',
        placeholder: '이름',
        keyboardType: 'default',
        secureTextEntry: false,
    },
    AGE: {
        title: '나이',
        placeholder: '나이',
        keyboardType: 'numeric',
        secureTextEntry: false,
    },
    INFO: {
        title: '상세 정보',
        placeholder: '상세 정보 입력',
        keyboardType: 'default',
        secureTextEntry: false,
    }
};

export const InputTypes2 = {
    NAME: 'NAME',
    AGE: 'AGE',
    INFO: 'INFO',
};

export const KeyboardTypes2 = {
    default: 'default',
    NUMERIC: 'numeric'
}

const Input2 = forwardRef(({ inputType2, styles, ...props }, ref) => {
    const {
        title,
        placeholder,
        keyboardType,
        secureTextEntry,
    } = InputTypeProps2[inputType2];

    const { value } = props;

    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={[defaultStyles.container, styles?.container]}>
            <View style={{flexDirection: 'row', flexWrap: 'nowrap'}}>
                <Text style={[
                    defaultStyles.title,
                    { 
                        // 이 곳에 일반적인 스타일들이 들어감
                        flex: 1,
                        textAlignVertical: 'center',
                        marginRight: 10,
                        fontWeight: 'bold',
                    },
                    styles?.title,
                ]}>{title}</Text>
                <View style={[
                    defaultStyles.inputContainer,
                    { borderColor: isFocused ? PRIMARY : GRAY },
                    styles?.inputContainer,
                ]}>
                    <TextInput
                        ref={ref}
                        style={[defaultStyles.input, styles?.input]}
                        placeholder={placeholder}
                        placeholderTextColor={GRAY}
                        keyboardType={keyboardType}
                        secureTextEntry={secureTextEntry}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        {...props}
                    />
                </View>
            </View>
        </View>
    );
});

const defaultStyles = StyleSheet.create({
    container: {
        width: '100%',
    },
    title: {
        fontSize: 18,
    },
    inputContainer: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 4,
    },
    input: {
        fontSize: 18,
    },
});

Input2.propTypes = {
    inputType2: PropTypes.oneOf(Object.values(InputTypes2)).isRequired,
    styles: PropTypes.object,
};

export default Input2;
