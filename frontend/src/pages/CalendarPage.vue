<script>
    let marks = {
        cycledMarks: [
            {
                id: 1,
                name: '18 дневный цикл',
                color: '#ffe856',
                baseDate: new Date(1980,7,3), //03.08.1980
                pattern: [false, false, false ,false, false, false, false, false, false, false, false, false, false, false, false, false, false, true], //паттерн длиной 18 дней
                description: 'Каждые 18 дней на Землю падает волна энергии. Следующий раз будет третьего августа. Вы сможете почувствовать это.' +
                ' Эта волна энергии может быть большой или маленькой, это зависит от обстоятельств. Если Земля получает большое количество энергии,' +
                ' то эта энергия вас достигнет, где бы вы не находились. По сравнению с величиной этой силы, Земля очень мала, и поэтому энергия' +
                ' достигает всех ее частей. © Карлос Кастанеда'
            },
            // {
            //     id: 2,
            //     name: 'Мяу мяу мяу',
            //     color: '#7671ff',
            //     baseDate: new Date(1980,7,3),
            //     pattern: [false, false, false ,true],
            //     description: 'Nunc meow nec velit meow nec meow libero vestibulum meow eleifend meow.' +
            //     ' Curabitur pulvinar meow congue luctus. Nullam meow hendrerit iaculis meow augue meow' +
            //     ' vitae ornare. Maecenas vehicula pulvinar tellus, meow id sodales felis lobortis eget. '
            // },
        ],
    };



    let lang = 'ru';

    export default {
        name: 'CalendarPage',
        metaInfo: {
            title: 'Календарь'
        },
        data() {
            return {
                now: new Date(),
                date: new Date(),
                view: 'year',
                items: [],
                selected: {day:null},
                marks: marks,
                activeTab: 0,
            }
        },
        mounted: function(){
            this.items = getYearItems(this.date);
            setToday(this.now, this.items);
            setSelectedDay(this.date, this.items, this.selected);
            setInterval(function(){
                this.now = new Date();
                setToday(this.now, this.items);
            }.bind(this), 5000);
        },
        watch: {
            date: function(newDate, oldDate){
                if(newDate.getFullYear() !== oldDate.getFullYear()){
                    this.items = getYearItems(newDate);
                    setToday(this.now, this.items);
                }
                this.activeTab = 0;
                setSelectedDay(newDate, this.items, this.selected);
                if(this.view === 'month'){
                    hideMonthExcept(newDate, this.items);
                }else if(this.view === 'year'){
                    showAllMonths(this.items);
                }
            },
            view: function(view){
                if(view === 'month'){
                    hideMonthExcept(this.date, this.items);
                }else if(view === 'year'){
                    showAllMonths(this.items);
                }
            }
        },
        computed: {
            year: function(){
                return this.date.getFullYear();
            },
            monthName: function(){
                return getMonthName(this.date.getMonth());
            },
            dateFormatted: function(){
                let day = this.date.getDate().toString();
                let month = this.date.getMonth()+1;
                month = month.toString();
                if(day.length < 2) day = "0"+day;
                if(month.length < 2) month = "0"+month;
                return day+"."+month+"."+this.date.getFullYear();
            }
        },
        methods:{
            prevYear: function(){
                this.date = new Date(this.date.getFullYear()-1, this.date.getMonth(), this.date.getDate());
            },
            nextYear: function(){
                this.date = new Date(this.date.getFullYear()+1, this.date.getMonth(), this.date.getDate());
            },
            prevMonth: function(){
                this.date = new Date(this.date.getFullYear(), this.date.getMonth()-1, this.date.getDate())
            },
            nextMonth: function(){
                this.date = new Date(this.date.getFullYear(), this.date.getMonth()+1, this.date.getDate())
            },
            selectDay:function(date, relate){
                if(this.view === 'year'){
                    if(relate){
                        this.date = date;
                        this.view = 'month';
                    }
                }else{
                    this.date = date;
                    this.view = 'month';
                }
            },
            getTooltipLabel: function (day){
                let str = "";
                for(let cycledMark of day.cycledMarks){
                    str += cycledMark.name+"\n";
                }
                return str;
            }
        }
    }

    function setSelectedDay(date, items, selected){
        unsetSelectedDay(items);
        let day = searchDay(date, items);
        if(day !== null){
            day.selected = true;
            selected.day = day;
        }
    }
    function unsetSelectedDay(items){
        for (let month of items) {
            for (let week of month.weeks) {
                for (let day of week.days) {
                    if(day.selected === true){
                        day.selected = false;
                    }
                }
            }
        }
    }

    function setToday(date, items){
        unsetToday(items);
        let day = searchDay(date, items);
        if(day !== null){
            day.today = true;
        }
    }
    function unsetToday(items){
        for (let month of items) {
            for (let week of month.weeks) {
                for (let day of week.days) {
                    if(day.today === true){
                        day.today = false;
                    }
                }
            }
        }
    }

    function searchDay(date, items){
        for (let month of items) {
            if(month.year === date.getFullYear()){
                if (month.month === date.getMonth()) {
                    for (let week of month.weeks) {
                        for (let day of week.days) {
                            if(day.relateToMonth === true && day.date === date.getDate()){
                                return day;
                            }
                        }
                    }
                }
            }else{
                return null;
            }
        }
        return null;
    }

    function hideMonthExcept(date, items){
        items.forEach(function (value, index) {
            if(date.getFullYear() === value.year && date.getMonth() === value.month){
                value.display = true;
            }else{
                value.display = false;
            }
        })
    }

    function showAllMonths(items){
        items.forEach(function (value, index) {
            value.display = true;
        })
    }

    //объект дня, сюда можно пушить вкусняшки
    function pushDayObject(date, relateToMonth){
        return {
            relateToMonth: relateToMonth,
            day: date.getDay(),
            date: date.getDate(),
            timestamp: date.getTime(),
            dateString: date.toDateString(),
            name: getDayName(date.getDay()),
            shortName: getDayName(date.getDay(), true),
            today: false,
            selected: false,
            cycledMarks: getMarks(date),
        }
    }

    function getMarks(date){
        let dayCycledMarks = [];
        for(let cycledMark of marks.cycledMarks){
            for(let i=0; i<cycledMark.pattern.length; i++){
                if(cycledMark.pattern[i]){
                    if(isDateInPattern(cycledMark.baseDate, date, i+1)){
                        dayCycledMarks.push(cycledMark);
                    }
                }
            }
        }
        return dayCycledMarks;
    }

    //основная функция проверки дат
    function isDateInPattern(baseDate, date, n){ //базовая дата, проверяемая дата, число дней через которое идет повторение
        //return !((date.getTime() - baseDate.getTime()) % (n*86400000));
        return ((date.getTime() - baseDate.getTime()) % (n*86400000)<86400000);
    }

    function pushMonthObject(date){
        return {
            month: date.getMonth(),
            year: date.getFullYear(),
            name: getMonthName(date.getMonth()),
            shortName: getMonthName(date.getMonth(), true),
            weeks: [],
            display: true
        }
    }

    function getYearItems(date){
        return getItems(new Date(date.getFullYear(), 0), new Date(date.getFullYear(), 11));
    }

    //основная функция для формирования массива items, без бочки бодрящего эльфийского чая не разобраться... хотя и то не факт
    function getItems(fromDate, toDate){
        if(toDate === undefined){
            toDate = fromDate;
        }
        let items = [];
        fromDate = new Date (fromDate.getFullYear(), fromDate.getMonth()-1);
        toDate = new Date (toDate.getFullYear(), toDate.getMonth()+2, 0);
        let monthCount = 0;
        let weeksFromNextMonthBuffer = [];
        let weeksFromCurrentMonthBuffer = [];
        let bufferTriggered = false;
        let relateToMonth;
        let monthBuffer;

        while(fromDate <= toDate){
            items.push(pushMonthObject(fromDate));

            if(0 in weeksFromNextMonthBuffer){
                weeksFromCurrentMonthBuffer = invertRelationToMonth(weeksFromCurrentMonthBuffer);
                weeksFromNextMonthBuffer[0].days = weeksFromCurrentMonthBuffer.concat(weeksFromNextMonthBuffer[0].days);
                items[monthCount].weeks = items[monthCount].weeks.concat(weeksFromNextMonthBuffer);
            }

            weeksFromNextMonthBuffer = [];
            weeksFromCurrentMonthBuffer = [];
            bufferTriggered = false;
            monthBuffer = fromDate.getMonth();

            while(items[monthCount].weeks.length < 6){
                items[monthCount].weeks.push({
                    days: []
                });
                if(fromDate.getMonth() !== monthBuffer){
                    weeksFromNextMonthBuffer.push({
                        days: []
                    });
                }
                if(fromDate.getDay() === 1){
                    relateToMonth = fromDate.getMonth() === monthBuffer;
                    items[monthCount].weeks[items[monthCount].weeks.length-1].days.push(
                        pushDayObject(fromDate, relateToMonth)
                    );
                    if(!relateToMonth){
                        if(!bufferTriggered){
                            weeksFromCurrentMonthBuffer = items[monthCount].weeks[items[monthCount].weeks.length-1].days.slice(
                                0,
                                items[monthCount].weeks[items[monthCount].weeks.length-1].days.length-1
                            );
                            bufferTriggered = true;
                        }
                        if(!(0 in weeksFromNextMonthBuffer)){
                            weeksFromNextMonthBuffer.push({
                                days: []
                            });
                        }
                        weeksFromNextMonthBuffer[weeksFromNextMonthBuffer.length-1].days.push(
                            pushDayObject(fromDate, true)
                        );
                    }
                    fromDate.setDate(fromDate.getDate()+1);
                }
                while(fromDate.getDay() !== 1){
                    relateToMonth = fromDate.getMonth() === monthBuffer;
                    items[monthCount].weeks[items[monthCount].weeks.length-1].days.push(
                        pushDayObject(fromDate, relateToMonth)
                    );
                    if(!relateToMonth){
                        if(!bufferTriggered){
                            weeksFromCurrentMonthBuffer = items[monthCount].weeks[items[monthCount].weeks.length-1].days.slice(
                                0,
                                items[monthCount].weeks[items[monthCount].weeks.length-1].days.length-1
                            );
                            bufferTriggered = true;
                        }
                        if(!(0 in weeksFromNextMonthBuffer)){
                            weeksFromNextMonthBuffer.push({
                                days: []
                            });
                        }
                        weeksFromNextMonthBuffer[weeksFromNextMonthBuffer.length-1].days.push(
                            pushDayObject(fromDate, true)
                        );
                    }
                    fromDate.setDate(fromDate.getDate()+1);
                }
            }
            monthCount++;
        }
        return items.slice(1, items.length-1);
    }

    function invertRelationToMonth(days){
        let arr = [];
        days.forEach(function (value, key){
            arr.push(JSON.parse(JSON.stringify(value)));
            arr[key].relateToMonth = !arr[key].relateToMonth;
        });
        return arr;
    }


    function getMonthName(id, isShort = false){
        switch (lang){
            case 'en':
                const names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                const namesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                if(isShort){
                    return namesShort[id];
                }
                return names[id];

            default:
                const ruNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
                const ruNamesShort = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
                if(isShort){
                    return ruNamesShort[id];
                }
                return ruNames[id];
        }
    }
    function getDayName(id, isShort = false){
        switch (lang){
            case 'en':
                const names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                const namesShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                if(isShort){
                    return namesShort[id];
                }
                return names[id];

            default:
                const ruNames = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота" ];
                const ruNamesShort = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
                if(isShort){
                    return ruNamesShort[id];
                }
                return ruNames[id];
        }
    }
</script>

<style lang="scss">
    @import '@/assets/variables.scss';

    $unrelatedColor: #b4b2ed;
    $todayBackgroundColor: #a3a2e4;
    $selectedDayBorderColor: lighten($dark, 20%);

    #calendar{
        max-width: 1500px;
        margin-left: auto;
        margin-right: auto;

        .calendar-nav-wrapper{
            display: flex;
            justify-content: space-between;
            align-items: center;
            .calendar-nav-group{
                display: flex;
                div{
                    padding: 3px 14px 6px;
                    text-align: center;
                }
            }
            .calendar-btn{
                background-color: $dark;
                color: $white;
                cursor: pointer;
                user-select: none;
            }
            .calendar-counter{
                font-weight: bold;
                user-select: none;
            }
        }
        .calendar-view{
            display: flex;
            flex-wrap: wrap;
            justify-content: center;

            .calendar-month{
                width: 360px;
                padding: 14px 14px 0;
            }
            .calendar-selected-day{
                width: 1080px;
                padding: 14px 14px 0;
                overflow: auto;
                a > span{
                    display: flex;
                    align-items: center;
                }
                i{
                    text-shadow: 0 0 1px black;
                }
                .icon{
                    margin: 0;
                    height: 22px;
                    width: 22px;
                }
            }
            .calendar-month-name{
                text-align: center;
                font-weight: bold;
                color: $black;
                user-select: none;
            }
            .calendar-days-names{
                display: flex;
                width: 100%;
                padding: 2px 0 2px;
            }
            .calendar-day-name{
                width: 14%;
                height: 30px;
                text-align: center;
                color: $black;
                user-select: none;
            }
            .calendar-week{
                display: flex;
                width: 100%;
            }
            .calendar-day-wrapper{
                position: relative;
                width: 14%;
                text-align: center;
                color: $unrelatedColor;
                user-select: none;
                font-weight: lighter;
                background-color: $white;
                border: 2px solid transparent;

                .calendar-day{
                    width: 100%;
                    height: 24px;

                }
                .calendar-mark-wrapper{
                    display: flex;
                    align-content: stretch;
                    width: 100%;
                    margin-top: -3px;
                    height: 5px;
                }
                .calendar-mark{
                    height: 100%;
                    flex-grow: 1;
                }

                .tooltip-wrapper{
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                }
                .day-tooltip {
                    width: 100%;
                    height: 100%;
                    &.tooltip:after {
                        white-space: pre;
                    }
                }
            }
            .today{
                background-color: $todayBackgroundColor;
            }
            .selected{
                border: 2px solid $selectedDayBorderColor;
            }
            .relate{
                cursor: pointer;
                font-weight: 600;
                color: $black;
            }
            .cursorPointer{
                cursor: pointer;
            }
        }
    }
</style>

<template>
    <div id="calendar">

        <div class="calendar-nav-wrapper">
            <div class="calendar-nav-group">
                <div v-if="view==='year'" v-on:click="prevYear()" class="calendar-btn"><</div>
                <div v-if="view==='year'" class="calendar-counter">{{year}}</div>
                <div v-if="view==='year'" v-on:click="nextYear()" class="calendar-btn">></div>

                <div v-if="view==='month'" v-on:click="prevMonth()" class="calendar-btn"><</div>
                <div v-if="view==='month'" class="calendar-counter">{{dateFormatted}}</div>
                <div v-if="view==='month'" v-on:click="nextMonth()" class="calendar-btn">></div>
            </div>
            <div class="calendar-nav-group">
                <div v-if="view==='month'" v-on:click="view='year'" class="calendar-btn">Назад</div>
                <!--<div v-if="view==='year'" v-on:click="view='month'" class="calendar-btn">Месяц</div>-->
            </div>
        </div>

        <div class="calendar-content-wrapper">
            <div class="calendar-view">
                <div v-for="month in items" v-if="month.display" class="calendar-month" v-bind:key="month.month">
                    <div class="calendar-month-name">{{month.name}}</div>
                    <div class="calendar-days-names">
                        <div v-for="day in items[0].weeks[0].days" class="calendar-day-name">{{ day.shortName }}</div>
                    </div>
                    <div v-for="week in month.weeks" class="calendar-week">
                        <div
                                v-for="day in week.days"
                                v-on:click="selectDay(new Date(day.timestamp), day.relateToMonth)"
                                class="calendar-day-wrapper"
                                :class="{relate: day.relateToMonth, today: day.today, selected: view==='month' && day.selected, cursorPointer: view==='month' && !day.relateToMonth}"
                        >
                            <div class="calendar-day">
                                {{ day.date }}
                            </div>
                            <div v-if="day.relateToMonth" class="calendar-mark-wrapper">
                                <div v-for="cycledMark in day.cycledMarks" v-bind:style="{ backgroundColor: cycledMark.color}" class="calendar-mark"></div>
                            </div>

                            <section v-if="day.cycledMarks.length > 0 && day.relateToMonth" class="tooltip-wrapper">
                                <b-tooltip class="day-tooltip" v-bind:label="getTooltipLabel(day)" multilined square size="is-small" type="is-dark">
                                </b-tooltip>
                            </section>
                        </div>
                    </div>
                </div>

                <div v-if="view==='month'" class="calendar-selected-day">
                    <template>
                        <b-tabs v-model="activeTab">

                            <b-tab-item>
                                <template slot="header">
                                    <span>{{selected.day.name}}</span>
                                </template>
                                Отметки: {{selected.day.cycledMarks.length}}<br>
                            </b-tab-item>

                            <b-tab-item v-if="selected.day !== null && selected.day.cycledMarks.length > 0" v-for="cycledMark in selected.day.cycledMarks" v-bind:key="cycledMark.id">
                                <template slot="header">
                                    <b-icon icon="bookmark" custom-size="fa-lg" v-bind:style="{ color: cycledMark.color}"></b-icon>
                                    <span>{{ cycledMark.name }}</span>
                                </template>
                                {{ cycledMark.description }}
                            </b-tab-item>
                        </b-tabs>
                    </template>
                </div>
            </div>
        </div>

    </div>
</template>