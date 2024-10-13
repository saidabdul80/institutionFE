<template>
  <div>
    <label :class="`text-[${$constants.neutral}] capitalize font-semibold`" v-if="label !== ''">
      {{ label }}
      <span v-if="isRequired" :class="`text-red-600`">*</span>
    </label>
    <InputText :disabled="disabled" v-model="inputValue" :id="id"  :pt="{root:{style:'height:'+(slim?'38px':'56px')}}"
            :readonly="true" :class="'bg-['+$constants.input_background+ '] w-full ' + ' border-[#ccc]'" />
    <div class="v-input__details" v-if="error_messages">
      <div class="text-red-900">{{ error_messages }}</div>
    </div>
  </div>
</template>

<script>
import TextField from './TextField.vue';
import AirDatepicker from 'air-datepicker';
import 'air-datepicker/air-datepicker.css';
import localeEn from 'air-datepicker/locale/en';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import PInput from './PInput.vue';
import InputText from 'primevue/inputtext';

export default {
  props: {
    modelValue: {
      type: [String, Object,Array],
      required: null,
    },
    format: {
      type: String,
      default: 'yyyy-mm-dd'
    },
    dateFormat: {
      type: String,
      default: 'yyyy-MM-dd'
    },
    timePicker:{
      type:Boolean,
      default:false
    },
    view:{
      type:String,
      default:'days'
    },
    minView:{
      type:String,
      default:'days'
    },
    label: {
      type: String,
      default: "Date"
    },
    error_messages: {
      type:[Array,String],
      default: null
    },
    range:{
      default:false
    },
    showWeekRange:{
      default:false
    },
    slim:{
      default:false
    },
    position:{
      default:null
    },
    isRequired:{
      default:false
    },
    disabled:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      id: ''
    }
  },
  methods: {
    customFormatter(date) {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    generateRandomId(length = 16) {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return `id_${result}`; 
    },
    setDefaultDate() {
      let date = "";
      if (!this.modelValue) {
        const firstOfMonth = startOfMonth(new Date());
        if (this.range) {
          const endOfMonthDate = endOfMonth(new Date());
          date  = [
            this.customFormatter(firstOfMonth),
            this.customFormatter(endOfMonthDate)
          ]
          this.$emit('update:modelValue', date);
        } else {
          date =this.customFormatter(firstOfMonth)
          this.$emit('update:modelValue', date);
        }
      }else{
        date = this.modelValue
      }
      return date;
    },
    initializeDatepicker() {
      const element = document.getElementById(this.id);
      
      if (element) {
        new AirDatepicker('#' + this.id, {
          view: this.view,
          minView: this.minView,
          dateFormat: this.dateFormat,
          locale: localeEn,
          range:this.range,
          multipleDatesSeparator: ' - ',
          isMobile: this.range,
          autoClose: this.range,  
          timepicker:this.timePicker,   
          timeFormat:'HH:mm:01',
          buttons: ['clear'],
          position:this.position?this.position:'bottom center',
          onSelect: ({ date, formattedDate,datepicker }) => {
            if (Array.isArray(date) && date.length === 2 && this.showWeekRange === true) {
          const [startDate, endDate] = date;
          const startDay = startDate.getDate();
          const endDay = endDate.getDate();
          const startMonth = startDate.toLocaleString('default', { month: 'short' });
          const year = startDate.getFullYear();   
          const customFormattedDate = `${startDay}-${endDay} - ${startMonth} ${year}`;
          
          this.$emit('update:modelValue', customFormattedDate);
          datepicker.$el.value = customFormattedDate;
        } else {
          this.$emit('update:modelValue', formattedDate);
        }
          }
        }).selectDate(this.setDefaultDate());
      } else {
        setTimeout(this.initializeDatepicker, 100);
      }
    }
  },
  mounted() {
    this.id = this.generateRandomId();
    
    this.$nextTick(() => {
      this.initializeDatepicker();
    });
  },
  components: {
    TextField,
    InputText
  },
  computed: {
    inputValue: {
      get() {
        if (Array.isArray(this.modelValue) && this.modelValue.length === 2) {
          return `${this.modelValue[0]} - ${this.modelValue[1]}`;
        }
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      }
    }
  }
}
</script>

<style scoped>
/* .v3dp__input_wrapper input {
  min-width: 100% !important;
  border: 1px solid #8d8d8d !important;
  height: 56px;
  border-radius: 5px;
  padding: 3px 7px;
}

.v3dp__input_wrapper input:focus {
  outline: none !important;
  border: 1px solid #999898 !important;
}

.v3dp__input_wrapper {
  position: relative !important;
}

.v3dp__clearable {
  position: absolute !important;
  left: auto;
  right: 18px;
  top: 10px;
} */
</style>
