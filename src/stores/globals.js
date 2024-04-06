export const globals ={   
    icons:{
      },
    colors:{
        ap_primary:'#6C39FF',
        ap_secondary:'#f5f5f5',
        primary:"sky-600",
        hoverPrimary:"sky-700",
        secondary:'',
        background:'sky-100',
        active:'white',
        warning:'#FDB022',
        warningLight: '#FFF9E8'
    },
    notification:{
        'message':[],
        'total_unread':0
    },
    school_info:1,
    reloadNotification:0,
    loading:false,
    route:{},
    updateMessage:'Updated Successfuly',
    createMessage:'Created Successfuly',
    deleteMessage:'Deleted Successfuly',
    failMessage:'Action cannot be completed',
    defaultMessageTimeout: 4000,
    messageTimeoutFunc:null,
    message: {text:'',type:'warning'},
    showMessage(msg,type='warning') {
        this.message.text = msg;
        this.message.type = type;
        try{
            clearTimeout(this.messageTimeoutFunc);
           this.messageTimeoutFunc = setTimeout(() => {
                this.message.text = '';
                this.message.type = 'warning';
            }, this.defaultMessageTimeout);
        }catch(e){

        }
    },    
    getConfiguration(name){
        const config = this.school_info.configurations?.find((config)=> config.name == name);
        if(config){
            return config.value == 'true';
        }
        return false
    },
    currentSession(){
        const config = this.school_info.configurations?.find((config)=> config.name == 'current_session');
        if(config){
            return config.value
        }
        return 0;
    },
    getConfigurationValue(name){
        const config = this.school_info.configurations.find((config)=> config.name == name);
        if(config){
            return config.value
        }
        return 0;
    },
    getStatus(status, value) {
        switch (status) {
            case value:
                return 'success';                
            default:
                return 'danger';                
        }
    },
    formatCurrency(value){
        return value.toLocaleString('en-US', { style: 'currency', currency: 'NGN' });
    }
}