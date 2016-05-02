/*
 * @author ricardo ferreira
 * @email ricardo.ferreira@ntk-consult.com.break
 *
 * plugin serve para buscar um determinado campo percorrendo a tabela do html
 */
(function ($) {

    var handlers = {
        trim: function (value) {

        }
    };

    var methods = {
        //atributo para definir o efeito zebra da tabela
        widgetZebra: {
            css: ["even", "odd"]
        },
        //metodo inicial que utiliza o keyup para enviar informacoes
        //quando o usuario lanca o evento no teclado
        init: function () {
            var $elemento = $(this);

            $elemento.bind("keyup", function () {
                methods.findRows($(this).val());
            });
        },
        /**
         * coloca a mensagem de alerta de que nao foi encontrado nenhuma automacao
         * se, e somente se nao for encontrada nenhuma automacao
         *          
         * @returns {undefined}
         */
        countRows: function () {
            var $elemento = $("table.td"),
                    $mensagem = '<p class="found_automacao">Não foi encontrada nenhuma automação!</p>',
                    $titulo = $elemento.find("tr.tr-titulo");

            if ($elemento.find('tbody > tr:visible').size() == 0) {
                $titulo.hide();

                if (!$('p.found_automacao').size()) {
                    $elemento.before($mensagem);
                    $elemento.hide();
                }
            }

            methods.zebra($elemento);
        },
        //percorre todas as linhas para fazer o efeito zebra na tabela
        zebra: function ($table) {
            var contador = 0;
            $table.find("tr").each(function (idx, value) {
                var odd, classes;

                if ($(value).attr("class") != "tr-titulo" && $(this).is(':visible')) {
                    odd = (contador % 2 == 0);
                    $(value).removeAttr("class");
                    classes = methods.widgetZebra.css[odd ? 0 : 1];
                    $(value).attr("class", classes);
                    contador++;
                }
            });
        },
        //busca nas linhas da tabela as linhas que tenham semelhanca com 
        //os registros digitados na busca
        findRows: function (value) {
            var $table = $("table.td"),
                $linhas = $table.find("tr");

            $table.show();
            $linhas.show();
            $table.find("td:contains('" + value + "')").closest('tr').attr("class", "find-field");

            if ($('p.found_automacao').size())
                $('p.found_automacao').remove();

            if (value != "") {
                $linhas.not(".find-field, .tr-titulo").hide();
                $linhas.find(".find-field").show().removeClass("class");
            } else {
                $linhas.show();
            }

            methods.zebra($table);
            methods.countRows();
        }
    };

    //metodo inicial que faz o plugin funcionar
    $.fn.findFields = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            return $.error('Method ' + method + ' does not exist on jQuery.find-fields');
        }
    };

})(jQuery);
