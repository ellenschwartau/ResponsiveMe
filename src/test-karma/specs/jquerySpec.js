/**
 * Created by Ellipirelli on 10.02.2015.
 */
it('test1', function() {
    $().destroyWin('window'); // jquery 1.3.2
    expect($j('#window')).not.toBeInDOM(); // $j = jquery 2.1.1
});