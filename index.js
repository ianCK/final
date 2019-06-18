$(document).ready(function() {
    start()
})

function start() {
    $('#decoline').removeClass('hide')
    $('#decoline').addClass('start')
    $('#decoline').on('animationend', function() {
        $(this).removeClass('start')
        $(this).off('animationend')
        $('#contentwrap').removeClass('hide')
        $('#title').addClass('start')
        $('#title').on('animationend', function() {
            $(this).removeClass('start')
            $(this).off('animationend')
            $('#seven_start').on('mousedown', function(e) {
                if (e.which == 1) {
                    $('#seven').removeClass('hide')
                    $($('#seven_start')).text('重新發牌')
                    play_seven()
                }
            })
        })
    })
}

function rand(l, r) {
    return Math.floor(Math.random() * (r - l + 1)) + Number(l)
}

function make_card(id, turn) {
    turn = (turn == 1) ? '' : 'turned_'
    return $('<img>').attr('id', 'card' + id).attr('class', 'card').attr('src', './cardbacks/' + turn + 'blue_back.jpg')
}

function cmp(a, b) {
    return a - b
}

function show_hand(player) {
    $hand = $('#hand>div:nth-child(' + player + ')>img')
    for (var i = 0; i < 13; i++) $($hand[i]).attr('src', './cards/' + ($($hand[i]).attr('id')).replace('card', '') + '.jpg')
}

function deal() {
    var hand = [
            [],
            [],
            [],
            []
        ],
        deck = [],
        $hand, a, b, temp, style = "top:0;left:"
    for (var i = 0; i < 52; i++) deck.push(i)
    for (var i = 0; i < 500; i++) {
        a = rand(0, 51)
        b = rand(0, 51)
        temp = deck[a]
        deck[a] = deck[b]
        deck[b] = temp
    }
    for (var i = 0; i < 52; i++) hand[Math.floor(i / 13)].push(deck[i])
    $('#seven>div>div').empty()
    for (var i = 0; i < 4; i++) {
        hand[i].sort(cmp)
        $hand = $('#hand>div:nth-child(' + (i + 1) + ')')
        style = style.replace('top', 'a').replace('left', 'top').replace('a', 'left')
        for (var j = 0; j < 13; j++) $($hand).append($(make_card(hand[i][j], i & 1)).attr('style', style + j * 7.5 + '%;z-index' + j + 2))
    }
    show_hand(4)
    for (var i = 0; i < 4; i++)
        for (var j = 0; j < 13; j++)
            if (hand[i][j] == 6) return i + 1
}

function play_card(player, card) {
    $('#card' + card).remove()
    $('#board>div:nth-child(' + Math.floor(card / 13 + 1) + ')').append($('<img>').attr('class', 'card').attr('src', './cards/' + card + '.jpg').attr('id', 'card' + card).attr('style', 'z-index:' + (card % 13) + 2 + ';left:' + (card % 13) * 7.5 + '%'))
    go(player % 4 + 1)
}

function discard(player, card) {
    $('#card' + card).remove()
    var style = (player & 1) ? 'top:15%' : 'left:15%'
    $('#discard>div:nth-child(' + player + ')').append($(make_card(card, (player ^ 1) & 1)).attr('style', style))
    go(player % 4 + 1)
}

function can_card(card) {
    if (card % 13 == 6) return true
    var board = $('#board>div:nth-child(' + Math.floor(card / 13 + 1) + ')>img')
    card %= 13
    for (var i = 0; i < board.length; i++) {
        var temp = Number(($(board[i]).attr('id')).replace('card', '')) % 13
        if (temp + 1 == card || temp - 1 == card) return true
    }
    return false
}

function can(player) {
    var hand = $('#hand>div:nth-child(' + player + ')>img')
    for (var i = 0; i < hand.length; i++)
        if (can_card(Number(($(hand[i]).attr('id')).replace('card', '')))) return true
    return false
}

function show_result() {
    var style = "top:0;left:",
        points = [],
        win = true
    for (var i = 1; i <= 4; i++) {
        var $dis = $('#discard>div:nth-child(' + i + ')>img'),
            hand = [],
            $hand = $('#hand>div:nth-child(' + i + ')'),
            point = 0,
            turn = i & 1 ? 'turn_' : ''
        style = style.replace('top', 'a').replace('left', 'top').replace('a', 'left')

        for (var j = 0; j < $dis.length; j++) hand.push(Number(($($dis[j]).attr('id')).replace('card', '')))
        $dis.remove()
        hand.sort(cmp)
        for (var j = 0; j < $dis.length; j++) {
            point += 13 - (hand[j] % 13)
            $($hand).append($('<img>').attr('id', 'card' + hand[j]).attr('class', 'card').attr('src', './cards/' + turn + hand[j] + '.jpg').attr('style', style + j * 7.5 + '%;z-index:' + j + 2))
        }
        $($hand).append($('<span>').text('得分:' + point))
        points.push(point)
    }
    for (var i = 0; i < 3; i++)
        if (points[3] > points[i]) {
            win = false;
            break;
        }
    if (win) warning('遊戲結束，您贏了')
    else warning('遊戲結束，您輸了')
}

function go(player) {
    clear_warning()
    var hand = $('#hand>div:nth-child(' + player + ')>img')
    if (hand.length == 0) show_result()
    else if (player == 4) {
        if (can(player)) {
            warning('輪到您了，請出牌')
            for (var i = 0; i < hand.length; i++) {
                temp = Number(($(hand[i]).attr('id')).replace('card', ''))
                if (can_card(temp)) {
                    $(hand[i]).addClass('active')
                    $(hand[i]).on('click', function(e) {
                        if (e.which == 1) {
                            $(hand).removeClass('active')
                            $(hand).off('click')
                            play_card(player, Number(($(this).attr('id')).replace('card', '')))
                        }
                    })
                }
            }
        } else {
            warning('輪到您了，請棄牌')
            $(hand).addClass('active')
            $(hand).on('click', function(e) {
                if (e.which == 1) {
                    $(hand).removeClass('active')
                    $(hand).off('click')
                    discard(player, Number(($(this).attr('id')).replace('card', '')))
                }
            })
        }
    } else {
        if (can(player)) {
            var pos = []
            for (var i = 0; i < hand.length; i++) {
                temp = Number(($(hand[i]).attr('id')).replace('card', ''))
                if (can_card(temp)) pos.push(temp)
            }
            var a = rand(0, pos.length - 1)
            play_card(player, pos[a])
        } else {
            var a = rand(0, hand.length - 1)
            discard(player, Number(($(hand[a]).attr('id')).replace('card', '')))
        }
    }
}

function warning(s) {
    $('#hint').text(s)
}

function clear_warning() {
    $('#hint').empty()
}

function play_seven() {
    player = deal()
    if (player == 4) {
        warning('持有黑桃七的人請先出牌')
        $('#card6').addClass('active')
        $('#card6').on('click', function(e) {
            if (e.which == 1) {
                $(this).off('click')
                $(this).removeClass('active')
                play_card(4, 6)
            }
        })
    } else play_card(player, 6)
}