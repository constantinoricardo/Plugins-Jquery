/**
 * 
 * @author ricardo.constantino
 * @email ricardo.constantino@actualsales.eu
 * @version 0.1
 * 
 * Plugin para gerenciar os elementos tabs das campanhas
 * 
 * @param {type} $
 * @returns {undefined}
 */
(function($) {
    var settings, 
        methodsStrategy = [],
        //objeto literal com as funções de clear dos elementos
        clearMethods = {
            'basic': ['elementClickTop', 'elementDisplay'],
            'sliderBasic': ['elementDisplay'],
            'sliderAdvanced': ['elementClickBottom', 'elementDisplay']
        },
        //objeto literal que seto e uso no strategy, porque aqui será setado o elemento
        //para que depois eu consiga limpar os elementos que devem ser limpados
        element = {
            elementClickTop: {},        //elemento do topo que será clicado            
            elementClickBottom: {},     //elemento de baixo que será clicado
            elementDisplay: {},         //elemento que aparecerá e desaparecerá
            following: []               //os elementos que seguiram o click do link quando ele for clicado
        };

    var setters = {
        /**
         * @author ricardo.constantino
         * @email ricardo.constantino@actualsales.eu
         * 
         * Nessa função colocamos a classes selection nos elementos de cima e de baixo,
         * para identificar que são os elementos atualmente clicados
         * 
         * @returns {undefined}
         */
        setTopBottom: function() {
            var $links = arguments[0],
                attrClass = arguments[1];

            $links.children().each(function(i) {
                $links.children().addClass(attrClass);
                if (i == 0)
                    $links.children().eq(i).addClass('selection');
            });

            if (attrClass == 'actual-link-top')
                element.elementClickTop[settings.element.attr('class')] = $links;
            else if (attrClass == 'actual-link-bottom')
                element.elementClickBottom[settings.element.attr('class')] = $links;
        },
        /**
         * @author ricardo.constantino
         * @email ricardo.constantino@actualsales.eu
         * 
         * Nessa função colocamos a classe identificadora .selection para identificar o conteudo
         * atual que deve ser mostrado e oculta-se todas as divs menos a primeira, porque
         * só é possível mostrar uma div
         * 
         * @returns {undefined}
         */
        setContent: function() {
            var $area = arguments[0];

            $area.children().each(function(i) {
                $area.children().addClass('actual-content');
                if (i != 0)
                    $area.children().eq(i).hide();
                else if (i == 0)
                    $area.children().eq(i).addClass('selection');
            });

            element.elementDisplay[settings.element.attr('class')] = $area;

        },
        /**
         * @author ricardo.constantino
         * @email ricardo.constantino@actualsales.eu
         * 
         * Seta a classe no botão esquerdo do slide, isso preciso
         * para que possamos identificar o clique e realizar as mudanças devidas
         * 
         * @returns {undefined}
         */
        setLeft: function() {
            var $left = arguments[0];
            $left.find('div').addClass('actual-link-left');
        },
        /**
         * @author ricardo.constantino
         * @email ricardo.constantino@actualsales.eu
         * 
         * Seta a classe no botão direito do slide, isso preciso
         * para que possamos identificar o clique e realizar as mudanças devidas
         * 
         * @returns {undefined}
         */
        setRight: function() {
            var $right = arguments[0];
            $right.find('div').addClass('actual-link-right');
        }
    };

    var handlers = {
        /**
         * @author ricardo.constantino
         * @email ricardo.constantino@actualsales.eu
         * 
         * Esta funcao seta as classes dos elementos html do plugin,
         * porque lá na frente teremos que pegar esses elementos para dar a funcionalidade
         * que o plugin se proprõe a fazer
         * 
         * @returns {undefined}
         */
        setBasic: function() {
            var $links = arguments[0],
                $area = arguments[1];

            setters.setTopBottom($links, 'actual-link-top');
            setters.setContent($area);

            handlers.execute(".actual-link-top");
        },
        /**
         * @author ricardo.constantino
         * @email ricardo.constantino@actualsales.eu
         * 
         * Esta função seta as classes dos elementos html do plugin na parte avançada,
         * porque lá na frente teremos que pegar esses elementos para dar funcionalidade
         * que o plugin se proprõe a fazer
         * 
         * @returns {undefined}
         */
        setSliderAdvanced: function() {
            var $content = arguments[0],
                $left = arguments[1],
                $right = arguments[2],
                $bottom = arguments[3];

            setters.setContent($content);
            setters.setLeft($left);
            setters.setRight($right);
            setters.setTopBottom($bottom, 'actual-link-bottom');

            handlers.execute(".actual-link-bottom");
            handlers.executeInSide();

        },
        setSliderBasic: function() {
            var $content = arguments[0],
                $left = arguments[1],
                $right = arguments[2];

            setters.setContent($content);
            setters.setLeft($left);
            setters.setRight($right);

            handlers.executeInSide();
        },
        /**
         * @author ricardo.constantino
         * @email ricardo.constantino@actualsales.eu
         * 
         * Serve para limpar a classe de todos os elementos retirando o attr class selection,
         * para que depois possamos setar no elemento clicado
         * 
         * @returns {undefined}
         */
        elementClickTop: function() {
            if (element.elementClickTop[settings.element.attr('class')] === undefined) return;
            
            element.elementClickTop[settings.element.attr('class')].children().each(function(value) {
                if ($(this).hasClass('selection'))
                    $(this).removeClass('selection');
            });
        },
        /**
         * @author ricardo.constantino
         * @email ricardo.constantino@actualsales.eu
         * 
         * Serve para limpar a classe de todos os elementos retirando o attr class selection dos
         * elementos abaixo para que depois possamos setar no elemento clicado
         * 
         * @returns {undefined}
         */
        elementClickBottom: function() {
            if (element.elementClickBottom[settings.element.attr('class')] === undefined) return;
            
            element.elementClickBottom[settings.element.attr('class')].children().each(function(value) {
                if ($(this).hasClass('selection'))
                    $(this).removeClass('selection');
            });
        },
        /**
         * @author ricardo.constantino
         * @email ricardo.constantino@actualsales.eu
         * 
         * Oculta os elementos com conteudo, para que depois
         * possa mostrar o elemento correto
         * 
         * @returns {undefined}
         */
        elementDisplay: function() {
            var identify = settings.element.attr('class');

            element.elementDisplay[identify].children().each(function(value) {
                if ($(this).hasClass('selection'))
                    $(this).removeClass('selection');

                $(this).hide('slow');
            });
        },
        /**
         * @author ricardo.constantino
         * @email ricardo.constantino@actualsales.eu
         * 
         * Faz um estrategy para chamar as funções de clear dinamicamente
         * 
         * @design pattern Strategy
         * @param array values
         * @returns {undefined}
         */
        strategyExecuter: function(values) {
                        
            $.each(methodsStrategy, function(idx, val) {
//                console.log(val);
                if (handlers[val] === undefined) return;
                handlers[val].apply(handlers);
            });
        },
        /**
         * 
         * @author ricardo.constantino
         * @email ricardo.constantino@actualsales.eu
         * 
         * Aqui é realizada toda a ação a partir do click do usuário
         * 
         * @returns {undefined}
         */
        execute: function() {
            var values,
                attrClass = arguments[0],
                $element = settings.element;

            $element.find(attrClass).bind('click', function(e) {
                settings.element = $element;

                if ($(this).hasClass('selection'))
                    return false;

                values = clearMethods[settings.typeTabs];

                handlers.strategyExecuter(values);
                handlers.tryContent($(this).index());

            });
        },
        /**
         * @author ricardo.constantino
         * @email ricardo.constantino@actualsales.eu
         * 
         * Aqui é realizada toda a ação a partir do click do usuário
         * nas setas esquerda e direita
         * 
         * @returns {undefined}
         */
        executeInSide: function() {
            var index, values,
                    $element = settings.element,
                    count = $element.find(".actual-content").size();

            $element.find('.actual-link-left').bind('click', function() {
                settings.element = $element;

                index = $element.find('.actual-content').filter('.selection').index();

                values = clearMethods[settings.typeTabs];

                handlers.strategyExecuter(values);
                handlers.tryInSideLeft(count, index);
            });

            $element.find('.actual-link-right').bind('click', function() {

                settings.element = $element;
                index = $element.find('.actual-content').filter('.selection').index();

                values = clearMethods[settings.typeTabs];

                handlers.strategyExecuter(values);
                handlers.tryInSideRight(count, index);
            });
        },
        /**
         * @author ricardo.constantino
         * @email ricardo.constantino@actualsales.eu
         * 
         * Aqui é a parte que executa o plugin, faz aparecer os elementos 
         * que devem aparecer quando o usuario clica no botao esquerdo
         * 
         * @returns {undefined}
         */
        tryInSideLeft: function() {
            var count = arguments[0],
                index = arguments[1],
                previous = index - 1;

            if (previous == -1)
                handlers.tryContent(count - 1);
            else
                handlers.tryContent(previous);
        },
        /**
         * @author ricardo.constantino
         * @email ricardo.constantino@actualsales.eu
         * 
         * Aqui é a parte que executa o plugin, faz aparecer os elementos 
         * que devem aparecer quando o usuario clica no botao direito
         * 
         * @returns {undefined}
         */
        tryInSideRight: function() {
            var count = arguments[0],
                index = arguments[1],
                next = index + 1;


            if (next >= count)
                handlers.tryContent(0);
            else
                handlers.tryContent(next);
        },
        /**
         * @author ricardo.constantino
         * @email ricardo.constantino@actualsales.eu
         * 
         * Aqui é a parte que executa o plugin, faz aparecer os elementos 
         * que devem aparecer quando o usuario clica no botao de cima ou no de baixo
         * 
         * @returns {undefined}
         */
        tryContent: function() {
            var index = arguments[0],
                $element = settings.element;

            $element.find(".actual-content").eq(index).addClass('selection').show('slow');
            $element.find(".actual-link-top, .actual-link-bottom").eq(index).addClass('selection');
        }
    };

    var methods = {
        /**
         * @author ricardo.constantino
         * @email ricardo.constantino@actualsales.eu
         * 
         * Método inicializador, é usado quando não é informado nenhum 
         * método na hora de chamar a funcionalidade do plugin
         * 
         * @param {type} options
         * @returns {unresolved}
         */
        init: function(options) {
            var $elemento = $(this);
            settings = $.extend({
                element: $(this),
                typeTabs: 'basic'
            }, options);                      
            
            return methods[settings.typeTabs].call(methods, $(this));            
        },
        /**
         * @author ricardo.constantino
         * @email ricardo.constantino@actualsales.eu
         * 
         * Tipo de slider basic, onde contém os botões do topo
         * e o conteudo,
         * tipo de slider default, ou seja, se não for informado nenhum
         * tipo de slider na chamada do plugin, é executado esse tipo de slider
         * 
         * @call $("div").actualTabs();
         * 
         * @returns {undefined}
         */
        basic: function($element) {
            var divs = [], top, content;

            $element.children().each(function() {
                var $elementos = $(this);
                if ($elementos.children().size() > 0)
                    divs.push($elementos);
            });

            top = divs[0];
            content = divs[1];

            methodsStrategy.push(settings.typeTabs);
            handlers.setBasic(top, content);
        },
        /**
         * @author ricardo.constantino
         * @email ricardo.constantino@actualsales.eu
         * 
         * Tipo de slider sliderAdvanced, onde contém os botões do topo, de baixo
         * e o conteudo
         * 
         * @call $("div").actualTabs({typeTabs: 'sliderAdvanced'});
         * 
         * @returns {undefined}
         */
        sliderAdvanced: function($element) {
            var divs = [], right, left, content, bottom;

            $element.children().each(function() {
                var $elementos = $(this);
                divs.push($elementos);
            });
            content = divs[0];
            left = divs[1];

            right = divs[2];
            bottom = divs[3];

            methodsStrategy.push(settings.typeTabs);
            handlers.setSliderAdvanced(content, left, right, bottom);
        },
        
        sliderBasic: function($element) {
            var divs = [], right, left, content;

            $element.children().each(function() {
                var $elementos = $(this);
                divs.push($elementos);
            });

            content = divs[0];
            left = divs[1];
            right = divs[2];
            
            methodsStrategy.push(settings.typeTabs);
            handlers.setSliderBasic(content, left, right);
        }
    };

    /**
     * @author ricardo.constantino
     * @email ricardo.constantino@actualsales.eu
     * 
     * Aqui é realizada uma inteligência padrão de todos os plugins,
     * aqui é executada primeiramente, pois verifica se o método existe ou
     * se ele é valido
     * 
     * @param {type} method
     * @returns {jQuery}
     */
    $.fn.actualTabs = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            return $.error('Method ' + method + ' does not exist on jQuery.actual-tabs');
        }
    }

})(jQuery);