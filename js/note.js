"use strict";

let demo = new Vue({
    el: '#demo',
    data: {
        raw_markdown: '# Marked in the browser\n\nRendered by **marked**.',
        parsed_markdown: '<p style="text-align:center"><img src="Images/welcome.png" /></p>'
            + '<h2 style="text-align:center">点击这里编辑笔记</h2>'
            + '<h3 style="text-align:center">Click here to edit notes</h3>',
        edit_mod: false,
        danger: false,
        ddl: 0,
        url: ''
    },
    mounted() {
        this.url = 'md-note://' + window.location.pathname;
        this.get_saved();
        this.check_danger();
        this.parse_markdown();
    }, 
    watch: {
        raw_markdown: function (newMarkdown, oldMarkdown) {
            let lastChar = newMarkdown.charAt(newMarkdown.length-1);
            if(lastChar!="\n"){
                return;
            }
            let lineEndBeforeLastLine = oldMarkdown.lastIndexOf("\n")
            let lastLine = oldMarkdown.substr(lineEndBeforeLastLine+1);
            let re = /^\s*/g;
            let spaceNum = lastLine.match(re)[0].length;
            this.raw_markdown+= " ".repeat(spaceNum);
            re = /^\s*- /g;
            if(lastLine.match(re)!=null){
                this.raw_markdown+= "- ";
            }
        }
    },
    methods: {
        get_saved() {
            this.raw_markdown = localStorage.getItem(this.url);
        },
        save() {
            localStorage.setItem(this.url, this.raw_markdown);
        },
        parse_markdown() {
            let today = new Date().getDate();
            this.danger = this.ddl - today <= 2 && this.ddl - today >= -10;

            let prefix = "## Deadline: \n";
            if (this.ddl == -1) {
                prefix += "# No ddl! \n";
            } else if (this.ddl - today <= 2) {
                if (this.ddl - today >= 0) {
                    prefix += "# " + (this.ddl - today) + " days \n";
                    prefix += "# Warning, ddl in 2 days \n";
                }
                else if (this.ddl - today >= -10) {
                    prefix += "# Did you miss it? \n";

                } else {
                    prefix += "# Next month \n";
                }
            } else {
                prefix += "# " + (this.ddl - today) + " days \n";
            }
            this.parsed_markdown = marked(prefix + this.raw_markdown);
        },
        check_danger() {
            let re = /- (\d+)/g;
            let first_date_str_ls = [];
            let first_date_match;
            while (first_date_match = re.exec(this.raw_markdown)) {
                first_date_str_ls.push(first_date_match[1]);
            };
            let first_date_ls = first_date_str_ls.map(parseFloat);
            first_date_ls.sort((a, b) => { return a - b; });
            if (first_date_ls.length == 0) {
                this.ddl = -1;
                this.danger = false;
                return;
            }
            let today = new Date().getDate();
            this.ddl = first_date_ls[0];
            this.danger = this.ddl - today <= 2 && this.ddl - today >= -10;
        },
        on_click_save() {
            this.edit_mod = false;
            this.save();
            this.check_danger();
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