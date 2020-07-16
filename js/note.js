"use strict";

let demo = new Vue({
    el: '#demo',
    data: {
        raw_markdown: '# Marked in the browser\n\nRendered by **marked**.',
        parsed_markdown: '<h2 style="text-align:center">点击这里编辑笔记</h2>'
            + '<h3 style="text-align:center">Click here to edit notes</h3>',
        final_markdown: "",
        edit_mod: false,
        danger: false,
        ddl: 0,
        url: '',
        timer: null,

        edit_trigger: true
    },
    mounted() {
        this.url = 'md-note://' + window.location.pathname;
        this.get_saved();
        this.parse_markdown();
    },
    methods: {
        get_saved() {
            this.raw_markdown = localStorage.getItem(this.url);
        },
        save() {
            localStorage.setItem(this.url, this.raw_markdown);
        },
        parse_markdown() {
            this.check_ddl();
            this.parsed_markdown = marked(this.raw_markdown);
            this.flush_ddl();
        },
        check_ddl() {
            let re = /- ([\d\.]+)(?: ([\d\:]+))?/g;
            let date_setters = [
                (date_obj,day)=>{date_obj.setDate(day)},
                (date_obj,month)=>{date_obj.setMonth(month-1)},
                (date_obj,year)=>{date_obj.setYear(year)},
            ]
            let time_setters = [
                (date_obj,hour)=>{date_obj.setHours(hour)},
                (date_obj,minute)=>{date_obj.setMinutes(minute)},
                (date_obj,second)=>{date_obj.setSeconds(second)},
            ]


            let first_date_ls = [];
            let first_date_match;
            while (first_date_match = re.exec(this.raw_markdown)) {
                let today = new Date();
                let this_ddl = new Date(0);
                this_ddl.setFullYear(today.getFullYear(),today.getMonth(),today.getDate());

                let raw_date = first_date_match[1];
                raw_date = raw_date.split(".").map(parseFloat);
                raw_date = raw_date.reverse();

                for(let i in raw_date){
                    date_setters[i](this_ddl,raw_date[i])
                }
                
                let raw_time = first_date_match[2];
                if(raw_time!=null){
                    raw_time = raw_time.split(":").map(parseFloat);
                    for(let i in raw_time){
                        time_setters[i](this_ddl,raw_time[i]);
                    }
                }else{
                    this_ddl.setHours(8);
                }
                first_date_ls.push(this_ddl);
            };
            first_date_ls.sort((a, b) => { return a - b });
            if (first_date_ls.length == 0) {
                this.ddl = [new Date(0)];
                this.danger = false;
                return;
            }
            this.ddl = first_date_ls;
        },
        flush_ddl() {
            let today = new Date();
            let first_ddl = this.ddl[0];
            this.danger = false;

            let prefix = "<h1>Deadline: ";
            if (first_ddl.getTime() == new Date(0).getTime()) {
                prefix += "No ddl!</h1>";
            } else if (first_ddl - today <= (2* 24 * 3600 * 1000)) {
                if (first_ddl - today >= 0) {
                    let totalMiliSecond = first_ddl.getTime() - today.getTime();
                    let days = Math.floor(totalMiliSecond / (24 * 3600 * 1000));

                    totalMiliSecond = totalMiliSecond % (24 * 3600 * 1000);
                    let hours = Math.floor(totalMiliSecond / (3600 * 1000));

                    totalMiliSecond = totalMiliSecond % (3600 * 1000);
                    let minutes = Math.floor(totalMiliSecond / (60 * 1000));

                    totalMiliSecond = totalMiliSecond % (60 * 1000);
                    let seconds = Math.round(totalMiliSecond / 1000);

                    prefix += days + ":" + hours + ":" + minutes + ":" + seconds + "</h1>";
                    prefix += "<h1>Warning, ddl in 2 days</h1>";

                    this.danger = true;
                }
                else {
                    prefix += "</h1>";
                    prefix += "<h1>Did you miss the ddl at " + first_ddl.toString() + "?</h1>";

                    this.danger = true;
                }
            } else {
                prefix += "<h1>" + Math.ceil((first_ddl - today) / 86400000) + " days</h1>";
            }

            this.final_markdown = prefix + this.parsed_markdown;

            if (this.timer != null) {
                clearTimeout(this.timer);
            }

            this.timer = setTimeout(this.flush_ddl, 1000)
        },
        on_click_save() {
            this.edit_mod = false;
            this.save();
            this.parse_markdown();
        },
        on_click_discard() {
            this.edit_mod = false;
        },
        on_click_content() {
            this.edit_mod = true;
        }
    }
})