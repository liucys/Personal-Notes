#### 使用D3.js构建组织关系树形图谱

```html
<!DOCTYPE html>
<html lang="zh">

<head>
    <meta charset="UTF-8" />
    <title>股权穿透图</title>
</head>
<script src="https://cdn.jsdelivr.net/npm/d3@7"></script>
<style>
    html,
    body {
        margin: 0;
    }

    html,
    body {
        width: 100%;
        height: 100%;
        background-color: #e1e1e1;
    }

    #app {
        width: 1600px;
        height: 800px;
        overflow: hidden;
        box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1);
        box-sizing: border-box;
        background-color: #ffffff;
        border-radius: 8px;
        position: relative;
        margin: 0 auto;
    }
</style>

<body>
    <div id="app"></div>
</body>
<script>
    let data = {
        key: '678b0be6df5c4274975bf4bf098bd424',
        title: '中国XXXX集团有限公司',
        credit_code: '911100001000089232',
        children: [
            {
                key: '18ceddde70714fe09a77abcc0e60674e',
                title: '中国XXXX制浆造纸研究院有限公司',
                credit_code: '91110000400001870P',
                children: [
                    {
                        key: '664651a01f9647d4989f47b70d56d919',
                        title: '北京格瑞物业管理有限公司',
                        credit_code: '911101056662761428',
                        children: [],
                        name: '北京格瑞物业管理有限公司',
                        id: '664651a01f9647d4989f47b70d56d919',
                        childCount: 0
                    },
                    {
                        key: '2e79481d01a44978be31f9797c11ae30',
                        title: '中轻特种纤维材料有限公司',
                        credit_code: '91131001678540844F',
                        children: [],
                        name: '中轻特种纤维材料有限公司',
                        id: '2e79481d01a44978be31f9797c11ae30',
                        childCount: 0
                    },
                    {
                        key: 'f2a2312108394c1598e2c1ba07f3c3b4',
                        title: '中国制浆造纸研究院有限公司衢州分院',
                        credit_code: '',
                        children: [],
                        name: '中国制浆造纸研究院有限公司衢州分院',
                        id: 'f2a2312108394c1598e2c1ba07f3c3b4',
                        childCount: 0
                    },
                    {
                        key: '72676c6a5ac1469da680965387e90061',
                        title: '中轻（晋江）卫生用品研究有限公司',
                        credit_code: '',
                        children: [],
                        name: '中轻（晋江）卫生用品研究有限公司',
                        id: '72676c6a5ac1469da680965387e90061',
                        childCount: 0
                    }
                ],
                name: '中国制浆造纸研究院有限公司',
                id: '18ceddde70714fe09a77abcc0e60674e',
                childCount: 4
            },
            {
                key: '49d4591e24884ec495cc94d26dab5ca5',
                title: '中国食品发酵工业研究院有限公司',
                credit_code: '91110000400001598H',
                children: [
                    {
                        key: '60c3a22edfb04107aa8e5d3ae7c83604',
                        title: '北京食发科贸有限公司',
                        credit_code: '911101051017126800',
                        children: [],
                        name: '北京食发科贸有限公司',
                        id: '60c3a22edfb04107aa8e5d3ae7c83604',
                        childCount: 0
                    },
                    {
                        key: 'a247c80994644700904de218ca6bc1ce',
                        title: '中食发（北京）科技发展有限公司',
                        credit_code: '',
                        children: [],
                        name: '中食发（北京）科技发展有限公司',
                        id: 'a247c80994644700904de218ca6bc1ce',
                        childCount: 0
                    },
                    {
                        key: '793453161121443a81ade7866428221a',
                        title: '中国食品工业（集团）有限公司',
                        credit_code: '91110000101317197N',
                        children: [],
                        name: '中国食品工业（集团）有限公司',
                        id: '793453161121443a81ade7866428221a',
                        childCount: 0
                    }
                ],
                name: '中国食品发酵工业研究院有限公司',
                id: '49d4591e24884ec495cc94d26dab5ca5',
                childCount: 3
            },
            {
                key: 'caa3bc30b4a349f2867f5a39b2c1a45a',
                title: '中国皮革制鞋研究院有限公司',
                credit_code: '91110000400012625M',
                children: [],
                name: '中国皮革制鞋研究院有限公司',
                id: 'caa3bc30b4a349f2867f5a39b2c1a45a',
                childCount: 0
            },
            {
                key: 'e0c6264e6b764a9ba7bcf12d26e45353',
                title: '中国日用化学研究院有限公司',
                credit_code: '91140000405747110H',
                children: [],
                name: '中国日用化学研究院有限公司',
                id: 'e0c6264e6b764a9ba7bcf12d26e45353',
                childCount: 0
            },
            {
                key: '89c1266532384e799f0daff0714af269',
                title: '中轻日化科技有限公司',
                credit_code: '91310116586831150K',
                children: [
                    {
                        key: 'a6251c23c9a94622a5db9a1dc2109b18',
                        title: '上海发凯化工有限公司',
                        credit_code: '913101167878670964',
                        children: [],
                        name: '上海发凯化工有限公司',
                        id: 'a6251c23c9a94622a5db9a1dc2109b18',
                        childCount: 0
                    },
                    {
                        key: '1c12e62ce93943b6871e7c63e27caaa6',
                        title: '中轻化工股份有限公司',
                        credit_code: '91330100609302981R',
                        children: [],
                        name: '中轻化工股份有限公司',
                        id: '1c12e62ce93943b6871e7c63e27caaa6',
                        childCount: 0
                    }
                ],
                name: '中轻日化科技有限公司',
                id: '89c1266532384e799f0daff0714af269',
                childCount: 2
            },
            {
                key: 'b88d045ed44a475f9477a4526e6d610e',
                title: '中轻检验认证有限公司',
                credit_code: '91110105MA01PLP86H',
                children: [],
                name: '中轻检验认证有限公司',
                id: 'b88d045ed44a475f9477a4526e6d610e',
                childCount: 0
            },
            {
                key: '61952ca5136e463796d8f5bb0653e8af',
                title: '中国海诚工程科技股份有限公司',
                credit_code: '91310000425011944Y',
                children: [
                    {
                        key: '74ef079feced4b469efa7dbf79adb5a8',
                        title: '中国轻工业成都设计工程有限公司',
                        credit_code: '9151010074364216XB',
                        children: [],
                        name: '中国轻工业成都设计工程有限公司',
                        id: '74ef079feced4b469efa7dbf79adb5a8',
                        childCount: 0
                    },
                    {
                        key: 'f446c1583a954bdc941c6f742dd63730',
                        title: '中国轻工业广州工程有限公司',
                        credit_code: '914401017459683310',
                        children: [],
                        name: '中国轻工业广州工程有限公司',
                        id: 'f446c1583a954bdc941c6f742dd63730',
                        childCount: 0
                    },
                    {
                        key: 'ee3c77a1a75e465490a954b33a83676f',
                        title: '中国轻工业长沙工程有限公司',
                        credit_code: '914300001837644754',
                        children: [],
                        name: '中国轻工业长沙工程有限公司',
                        id: 'ee3c77a1a75e465490a954b33a83676f',
                        childCount: 0
                    },
                    {
                        key: 'bf2ece53d4d74f7798018ec097489e64',
                        title: '中国轻工业武汉设计工程有限责任公司',
                        credit_code: '91420000744624991J',
                        children: [],
                        name: '中国轻工业武汉设计工程有限责任公司',
                        id: 'bf2ece53d4d74f7798018ec097489e64',
                        childCount: 0
                    },
                    {
                        key: 'c5883284dbb949228e63e0d1bdb790ad',
                        title: '中国中轻国际工程有限公司',
                        credit_code: '91110105710930851H',
                        children: [],
                        name: '中国中轻国际工程有限公司',
                        id: 'c5883284dbb949228e63e0d1bdb790ad',
                        childCount: 0
                    },
                    {
                        key: 'a443e299afcc494d8e7d717eda8fd68d',
                        title: '中国轻工业南宁设计工程有限公司',
                        credit_code: '91450100745119997C',
                        children: [],
                        name: '中国轻工业南宁设计工程有限公司',
                        id: 'a443e299afcc494d8e7d717eda8fd68d',
                        childCount: 0
                    },
                    {
                        key: '591b68dfd4024037a6b0cd190db223cd',
                        title: '中国轻工建设工程有限公司',
                        credit_code: '911101026631073512',
                        children: [],
                        name: '中国轻工建设工程有限公司',
                        id: '591b68dfd4024037a6b0cd190db223cd',
                        childCount: 0
                    },
                    {
                        key: 'fb4ec0e4c60746699532a394cb68af27',
                        title: '中国轻工业西安设计工程有限责任公司',
                        credit_code: '',
                        children: [],
                        name: '中国轻工业西安设计工程有限责任公司',
                        id: 'fb4ec0e4c60746699532a394cb68af27',
                        childCount: 0
                    }
                ],
                name: '中国海诚工程科技股份有限公司',
                id: '61952ca5136e463796d8f5bb0653e8af',
                childCount: 8
            },
            {
                key: '5a32c1a7db114bc2a0bf5cb479bee0d8',
                title: '中轻长泰（长沙）智能科技股份有限公司',
                credit_code: '91430100712168581G',
                children: [],
                name: '中轻长泰（长沙）智能科技股份有限公司',
                id: '5a32c1a7db114bc2a0bf5cb479bee0d8',
                childCount: 0
            },
            {
                key: 'e606c3e224984e4782a2461560a3d33a',
                title: '中国中轻国际控股有限公司',
                credit_code: '911100001000010519',
                children: [
                    {
                        key: '5bd9c5897b8f4360b1273818ab759903',
                        title: '中轻物产重庆有限公司',
                        credit_code: '91500108202803776W',
                        children: [],
                        name: '中轻物产重庆有限公司',
                        id: '5bd9c5897b8f4360b1273818ab759903',
                        childCount: 0
                    },
                    {
                        key: '1dbafc2de22144138790994c6e070ebf',
                        title: '中轻物产沈阳有限公司',
                        credit_code: '912101067020340102',
                        children: [],
                        name: '中轻物产沈阳有限公司',
                        id: '1dbafc2de22144138790994c6e070ebf',
                        childCount: 0
                    },
                    {
                        key: '2497607ef24f496ba4423df2308885f9',
                        title: '中轻物产大连有限公司',
                        credit_code: '912102422418131093',
                        children: [],
                        name: '中轻物产大连有限公司',
                        id: '2497607ef24f496ba4423df2308885f9',
                        childCount: 0
                    },
                    {
                        key: '5f1ab007a3d3489498a767ed044d1b59',
                        title: '广州海诚能源科技有限公司',
                        credit_code: '91440113579965345C',
                        children: [],
                        name: '广州海诚能源科技有限公司',
                        id: '5f1ab007a3d3489498a767ed044d1b59',
                        childCount: 0
                    },
                    {
                        key: 'e80d9bb74d1249e19149baf0375d4765',
                        title: '中轻华信工程科技管理有限公司',
                        credit_code: '91110000710930931P',
                        children: [],
                        name: '中轻华信工程科技管理有限公司',
                        id: 'e80d9bb74d1249e19149baf0375d4765',
                        childCount: 0
                    },
                    {
                        key: 'a271ab30fb8d4cd4a2eb68b991b73592',
                        title: '中轻物产广州有限公司',
                        credit_code: '914401017082754802',
                        children: [],
                        name: '中轻物产广州有限公司',
                        id: 'a271ab30fb8d4cd4a2eb68b991b73592',
                        childCount: 0
                    },
                    {
                        key: 'cca22a07b5214e50b5e23017da74c2a4',
                        title: '南宁轻工业工程院有限公司',
                        credit_code: '91450100498504379P',
                        children: [],
                        name: '南宁轻工业工程院有限公司',
                        id: 'cca22a07b5214e50b5e23017da74c2a4',
                        childCount: 0
                    },
                    {
                        key: 'f6fc3d058dd347d581af52f481b9d4c4',
                        title: '陕西中轻轻工业工程院有限公司',
                        credit_code: '91610000435230147E',
                        children: [],
                        name: '陕西中轻轻工业工程院有限公司',
                        id: 'f6fc3d058dd347d581af52f481b9d4c4',
                        childCount: 0
                    },
                    {
                        key: 'beab8b01f18c4e168a44e4bf7426a231',
                        title: '中轻科技成都有限公司',
                        credit_code: '915101004507536838',
                        children: [],
                        name: '中轻科技成都有限公司',
                        id: 'beab8b01f18c4e168a44e4bf7426a231',
                        childCount: 0
                    },
                    {
                        key: '94e03671052e461b98b90d9d4a630712',
                        title: '中轻物产股份有限公司',
                        credit_code: '9131000063142300XM',
                        children: [],
                        name: '中轻物产股份有限公司',
                        id: '94e03671052e461b98b90d9d4a630712',
                        childCount: 0
                    },
                    {
                        key: '457f045838e44eb49ed5cdf7729051d8',
                        title: '中国海诚投资发展有限公司',
                        credit_code: '91110000100007437U',
                        children: [
                            {
                                key: 'f981b63b0e7142b2ae6886dd17808deb',
                                title: '中国海诚投资发展有限公司廊坊机电设备制造厂',
                                credit_code: '',
                                children: [],
                                name: '中国海诚投资发展有限公司廊坊机电设备制造厂',
                                id: 'f981b63b0e7142b2ae6886dd17808deb',
                                childCount: 0
                            },
                            {
                                key: 'ba1ac4d2434541fcb0dd1d6f2aac1685',
                                title: '中国轻工集团高级技工学校',
                                credit_code: '',
                                children: [],
                                name: '中国轻工集团高级技工学校',
                                id: 'ba1ac4d2434541fcb0dd1d6f2aac1685',
                                childCount: 0
                            },
                            {
                                key: '70c48ddf90fd4df394c6d3d9d0faa001',
                                title: '中国海诚投资发展有限公司廊坊分部',
                                credit_code: '',
                                children: [],
                                name: '中国海诚投资发展有限公司廊坊分部',
                                id: '70c48ddf90fd4df394c6d3d9d0faa001',
                                childCount: 0
                            }
                        ],
                        name: '中国海诚投资发展有限公司',
                        id: '457f045838e44eb49ed5cdf7729051d8',
                        childCount: 3
                    },
                    {
                        key: '63e0cae2caec473f93e5e349fffe6179',
                        title: '湖北中轻控股武汉轻工院有限公司',
                        credit_code: '91420000177588014X',
                        children: [],
                        name: '湖北中轻控股武汉轻工院有限公司',
                        id: '63e0cae2caec473f93e5e349fffe6179',
                        childCount: 0
                    },
                    {
                        key: 'ffdb4017d60949d0b224ff9ddc61dac4',
                        title: '中国中轻国际控股福建有限公司',
                        credit_code: '91350000158152987C',
                        children: [],
                        name: '中国中轻国际控股福建有限公司',
                        id: 'ffdb4017d60949d0b224ff9ddc61dac4',
                        childCount: 0
                    },
                    {
                        key: 'be962b1d8286444fa39d95769d69e442',
                        title: '中国轻鑫工程厦门有限公司',
                        credit_code: '913502001549907727',
                        children: [],
                        name: '中国轻鑫工程厦门有限公司',
                        id: 'be962b1d8286444fa39d95769d69e442',
                        childCount: 0
                    },
                    {
                        key: '2b056e9116864d6aa97f78364c7985d1',
                        title: '中国中轻国际控股公司长沙分公司',
                        credit_code: '',
                        children: [],
                        name: '中国中轻国际控股公司长沙分公司',
                        id: '2b056e9116864d6aa97f78364c7985d1',
                        childCount: 0
                    },
                    {
                        key: 'b7b133c08a814fa6abdc60a1751f637b',
                        title: '中轻华贸（北京）国际贸易有限责任公司',
                        credit_code: '',
                        children: [],
                        name: '中轻华贸（北京）国际贸易有限责任公司',
                        id: 'b7b133c08a814fa6abdc60a1751f637b',
                        childCount: 0
                    },
                    {
                        key: '7c333a2e44ec4fa88a7fee45165d2aa4',
                        title: '中轻物产公司连云港分公司',
                        credit_code: '',
                        children: [],
                        name: '中轻物产公司连云港分公司',
                        id: '7c333a2e44ec4fa88a7fee45165d2aa4',
                        childCount: 0
                    }
                ],
                name: '中国中轻国际控股有限公司',
                id: 'e606c3e224984e4782a2461560a3d33a',
                childCount: 20
            },
            {
                key: '28ceddde70714fe09a77abcc0e60675f',
                title: '中轻国际经济合作有限公司',
                credit_code: '91320100710934561P',
                children: [],
                name: '中轻国际经济合作有限公司',
                id: '28ceddde70714fe09a77abcc0e60675f',
                childCount: 0
            }
        ],
        name: '中国轻工集团有限公司',
        id: '678b0be6df5c4274975bf4bf098bd424',
        childCount: 47
    }
</script>
<script>
    // 股权树
    class StockTree {
        constructor(options) {
            // 树的源数据
            this.originTreeData = options.originTreeData;
            // 宿主元素选择器
            this.el = options.el;
            this.nodeClickEvent = options.nodeClickEvent || function (e, d) {
                alert(d.name)
            }
            // 一些配置项
            this.config = {
                // 节点的横向距离
                dx: 100,
                // 节点的纵向距离
                dy: 370,
                // svg的viewBox的宽度
                width: 0,
                // svg的viewBox的高度
                height: 0,
                // 节点的矩形框宽度
                rectWidth: 170,
                // 节点的矩形框高度
                rectHeight: 70,
            };
            this.svg = null;
            this.gAll = null;
            this.gLinks = null;
            this.gNodes = null;
            // 给树加坐标点的方法
            this.tree = null;
            // 投资公司树的根节点
            this.rootOfDown = null;
            // 股东树的根节点
            this.rootOfUp = null;

            this.drawChart({
                type: 'fold',
            });
        }

        // 初始化树结构数据
        drawChart(options) {
            // 宿主元素的d3选择器对象
            let host = d3.select(this.el);
            // 宿主元素的DOM，通过node()获取到其DOM元素对象
            let dom = host.node();
            // 宿主元素的DOMRect
            let domRect = dom.getBoundingClientRect();
            // svg的宽度和高度
            this.config.width = domRect.width;
            this.config.height = 986;

            let oldSvg = d3.select('svg')
            // 如果宿主元素中包含svg标签了，那么则删除这个标签，再重新生成一个
            if (!oldSvg.empty()) {
                oldSvg.remove();
            }

            const svg = d3
                .create("svg")
                .attr("viewBox", () => {
                    let parentsLength = this.originTreeData.parents ? this.originTreeData.parents.length : 0;
                    return [-150, parentsLength > 0 ? -this.config.height / 2 : -this.config.height / 3, this.config.width, this.config.height,]
                })
                .style("user-select", "none")
                .style("cursor", "move");

            // 包括连接线和节点的总集合
            const gAll = svg.append("g").attr("id", "all");
            svg.call(
                d3
                    .zoom()
                    .scaleExtent([0.2, 5])
                    .on("zoom", (e) => {
                        gAll.attr("transform", () => {
                            return `translate(${e.transform.x},${e.transform.y}) scale(${e.transform.k})`;
                        });
                    })
            ).on("dblclick.zoom", null);// 取消默认的双击放大事件

            this.gAll = gAll;
            // 连接线集合
            this.gLinks = gAll.append("g").attr("id", "linkGroup");
            // 节点集合
            this.gNodes = gAll.append("g").attr("id", "nodeGroup");
            // 设置好节点之间距离的tree方法
            this.tree = d3.tree().nodeSize([this.config.dx, this.config.dy]);

            this.rootOfDown = d3.hierarchy(this.originTreeData, (d) => d.children);
            this.rootOfUp = d3.hierarchy(this.originTreeData, (d) => d.parents);
            this.tree(this.rootOfDown);

            [this.rootOfDown.descendants(), this.rootOfUp.descendants()].forEach((nodes) => {
                nodes.forEach((node) => {
                    node._children = node.children || null;
                    if (options.type === 'all') {
                        //如果是all的话，则表示全部都展开
                        node.children = node._children;
                    } else if (options.type === 'fold') { //如果是fold则表示除了父节点全都折叠
                        // 将非根节点的节点都隐藏掉（其实对于这个组件来说加不加都一样）
                        if (node.depth) {
                            node.children = null;
                        }
                    }
                });
            });

            this.svg = svg;
            this.update();
            // 将svg置入宿主元素中
            host.append(function () {
                return svg.node();
            });
        }

        // 更新数据
        update(source) {
            if (!source) {
                source = {
                    x0: 0,
                    y0: 0,
                };
                // 设置根节点所在的位置（原点）
                this.rootOfDown.x0 = 0;
                this.rootOfDown.y0 = 0;
                this.rootOfUp.x0 = 0;
                this.rootOfUp.y0 = 0;
            }

            let nodesOfDown = this.rootOfDown.descendants().reverse();
            let linksOfDown = this.rootOfDown.links();
            let nodesOfUp = this.rootOfUp.descendants().reverse();
            let linksOfUp = this.rootOfUp.links();

            this.tree(this.rootOfDown);
            this.tree(this.rootOfUp);

            const myTransition = this.svg.transition().duration(500);

            /***  绘制子公司树  ***/
            const node1 = this.gNodes
                .selectAll("g.nodeOfDownItemGroup")
                .data(nodesOfDown, (d) => {
                    return d.data.id;
                });

            const node1Enter = node1
                .enter()
                .append("g")
                .attr("class", "nodeOfDownItemGroup")
                .attr("transform", (d) => {
                    return `translate(${source.y0},${source.x0})`;
                })
                .attr("fill-opacity", 0)
                .attr("stroke-opacity", 0)
                .style("cursor", "pointer");

            // 外层的矩形框
            node1Enter
                .append("rect")
                .attr("width", (d) => {
                    if (d.depth === 0) {
                        return (d.data.name.length + 2) * 16;
                    }
                    return this.config.rectWidth;
                })
                .attr("height", (d) => {
                    if (d.depth === 0) {
                        return 30;
                    }
                    return this.config.rectHeight;
                })
                .attr("x", (d) => {
                    if (d.depth === 0) {
                        return (-(d.data.name.length + 2) * 16) / 2;
                    }
                    return -this.config.rectWidth / 2;
                })
                .attr("y", (d) => {
                    if (d.depth === 0) {
                        return -15;
                    }
                    return -this.config.rectHeight / 2;
                })
                .attr("rx", 5)
                .attr("stroke-width", 1)
                .attr("stroke", (d) => {
                    if (d.depth === 0) {
                        return "#5682ec";
                    }
                    return "#7A9EFF";
                })
                .attr("fill", (d) => {
                    if (d.depth === 0) {
                        return "#7A9EFF";
                    }
                    return "#FFFFFF";
                })
                .on("click", (e, d) => {
                    this.nodeClickEvent(e, d)
                });
            // 文本主标题
            node1Enter
                .append("text")
                .attr("class", "main-title")
                .attr("x", (d) => {
                    return 0;
                })
                .attr("y", (d) => {
                    if (d.depth === 0) {
                        return 5;
                    }
                    return -14;
                })
                .attr("text-anchor", (d) => {
                    return "middle";
                })
                .text((d) => {
                    if (d.depth === 0) {
                        return d.data.name;
                    } else {
                        return d.data.name.length > 11
                            ? d.data.name.substring(0, 11)
                            : d.data.name;
                    }
                })
                .attr("fill", (d) => {
                    if (d.depth === 0) {
                        return "#FFFFFF";
                    }
                    return "#000000";
                })
                .style("font-size", (d) => (d.depth === 0 ? 16 : 14))
                .style('font-family', '黑体')
                .style("font-weight", "bold");
            // 副标题
            node1Enter
                .append("text")
                .attr("class", "sub-title")
                .attr("x", (d) => {
                    return 0;
                })
                .attr("y", (d) => {
                    return 5;
                })
                .attr("text-anchor", (d) => {
                    return "middle";
                })
                .text((d) => {
                    if (d.depth !== 0) {
                        let subTitle = d.data.name.substring(11);
                        if (subTitle.length > 10) {
                            return subTitle.substring(0, 10) + "...";
                        }
                        return subTitle;
                    }
                })
                .style("font-size", (d) => 14)
                .style('font-family', '黑体')
                .style("font-weight", "bold");

            // 子公司数量
            node1Enter
                .append("text")
                .attr("class", "percent")
                .attr("x", (d) => {
                    return -5;
                })
                .attr("y", (d) => {
                    return 25;
                })
                .text((d) => {
                    if (d.depth !== 0) {
                        return d.data.childCount || '';
                    }
                })
                .attr("fill", "#307AC0")
                .style('font-family', '黑体')
                .style("font-size", (d) => 14);

            // 增加展开按钮
            const expandBtnG = node1Enter
                .append("g")
                .attr("class", "expandBtn")
                .attr("transform", (d) => {
                    return `translate(${this.config.rectHeight + 20},${-6})`;
                })
                .style("display", (d) => {
                    // 如果是根节点，不显示
                    if (d.depth === 0) {
                        return "none";
                    }
                    // 如果没有子节点，则不显示
                    if (!d._children) {
                        return "none";
                    }
                })
                .on("click", (e, d) => {
                    if (d.children) {
                        d._children = d.children;
                        d.children = null;
                    } else {
                        d.children = d._children;
                    }
                    this.update(d);
                });

            expandBtnG
                .append("circle")
                .attr("r", 8)
                .attr("fill", "#7A9EFF")
                .attr("cy", 8);

            expandBtnG
                .append("text")
                .attr("text-anchor", "middle")
                .attr("fill", "#ffffff")
                .attr("y", 13)
                .style('font-size', 16)
                .style('font-family', '微软雅黑')
                .text((d) => {
                    return d.children ? "-" : "+"
                });

            const link1 = this.gLinks
                .selectAll("path.linkOfDownItem")
                .data(linksOfDown, (d) => d.target.data.id);

            const link1Enter = link1
                .enter()
                .append("path")
                .attr("class", "linkOfDownItem")
                .attr("d", (d) => {
                    let o = {
                        source: {
                            x: source.x0,
                            y: source.y0,
                        },
                        target: {
                            x: source.x0,
                            y: source.y0,
                        },
                    };
                    return this.drawLink(o);
                })
                .attr("fill", "none")
                .attr("stroke", "#7A9EFF")
                .attr("stroke-width", 1)
                .attr("marker-end", "url(#markerOfDown)");

            // 有元素update更新和元素新增enter的时候
            node1
                .merge(node1Enter)
                .transition(myTransition)
                .attr("transform", (d) => {
                    return `translate(${d.y},${d.x})`;
                })
                .attr("fill-opacity", 1)
                .attr("stroke-opacity", 1);

            // 有元素消失时
            node1
                .exit()
                .transition(myTransition)
                .remove()
                .attr("transform", (d) => {
                    return `translate(${source.y0},${source.x0})`;
                })
                .attr("fill-opacity", 0)
                .attr("stroke-opacity", 0);

            link1.merge(link1Enter).transition(myTransition).attr("d", this.drawLink);

            link1
                .exit()
                .transition(myTransition)
                .remove()
                .attr("d", (d) => {
                    let o = {
                        source: {
                            x: source.x,
                            y: source.y,
                        },
                        target: {
                            x: source.x,
                            y: source.y,
                        },
                    };
                    return this.drawLink(o);
                });

            // node数据改变的时候更改一下加减号
            const expandButtonsSelection = d3.selectAll('g.expandBtn')

            expandButtonsSelection.select('text').transition().text((d) => {
                return d.children ? "-" : "+";
            })

            this.rootOfDown.eachBefore((d) => {
                d.x0 = d.x;
                d.y0 = d.y;
            });
            this.rootOfUp.eachBefore((d) => {
                d.x0 = d.x;
                d.y0 = d.y;
            });
        }

        // 直角连接线 by wushengyuan
        drawLink({ source, target }) {
            // const halfDistance = (target.y - source.y) / 2;
            // const halfY = source.y + halfDistance;
            // return `M${source.x},${source.y} L${source.x},${halfY} ${target.x},${halfY} ${target.x},${target.y}`;
            let s = source, d = target;
            return `M ${s.y} ${s.x}
                L ${(s.y + d.y) / 2} ${s.x},
                L ${(s.y + d.y) / 2} ${d.x},
                ${d.y} ${d.x}`
        }

        // 展开所有的节点
        expandAllNodes() {
            this.drawChart({
                type: 'all',
            })
        }

        // 将所有节点都折叠
        foldAllNodes() {
            this.drawChart({
                type: 'fold',
            })
        }
    }

    const tree = new StockTree({
        el: "#app",
        originTreeData: data,
        // 节点点击事件
        nodeClickEvent: function (e, d) {
            console.log('当前节点的数据：', d)
        }
    });
</script>

</html>
```