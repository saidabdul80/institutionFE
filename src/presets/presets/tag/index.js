export default {
    root: ({ props }) => ({
        class: [
            //Font
            'text-xs ',

            //Alignments
            'inline-flex items-center justify-center',

            //Spacing
            'px-2 py-1 cursor-pointer',


            //Shape
            {
                'rounded-md': !props.rounded,
                'rounded-full': props.rounded
            },

            //Colors
            'dark:text-surface-900 font-extrabold',
            {
                'bg-primary-500 dark:bg-primary-400': props.severity == null || props.severity == 'primary',
                'bg-green-500/20 text-green-500 dark:bg-green-400': props.severity == 'success',
                'bg-blue-500 dark:bg-blue-400': props.severity == 'info',
                'bg-orange-500/20 text-orange-500 dark:bg-orange-400': props.severity == 'warning',
                'bg-gray-400/20 hover:bg-gray-500 hover:text-white text-gray-500 dark:bg-gray-400': props.severity == 'secondary',
                'bg-red-500 dark:bg-red-400': props.severity == 'danger'
            }
        ]
    }),
    value: {
        class: 'leading-normal font-bold'
    },
    icon: {
        class: 'mr-1 text-xs font-bold'
    }
};
