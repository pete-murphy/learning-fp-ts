export default '<div class="sourceCode" id="cb1"><pre class="sourceCode haskell"><code class="sourceCode haskell"><span id="cb1-1"><a href="#cb1-1"></a><span class="ot">personFromId ::</span> <span class="dt">Int</span> <span class="ot">-&gt;</span> <span class="dt">Maybe</span> <span class="dt">Person</span></span><span id="cb1-2"><a href="#cb1-2"></a>personFromId <span class="fu">id</span> <span class="ot">=</span></span><span id="cb1-3"><a href="#cb1-3"></a>  Map.lookup <span class="fu">id</span> nameAndCityIdByNameId</span><span id="cb1-4"><a href="#cb1-4"></a>    <span class="op">&gt;&gt;=</span> \\{ name, cityId } <span class="ot">-&gt;</span></span><span id="cb1-5"><a href="#cb1-5"></a>        Map.lookup cityId cityNameById</span><span id="cb1-6"><a href="#cb1-6"></a>          <span class="op">&lt;#&gt;</span> \\city <span class="ot">-&gt;</span></span><span id="cb1-7"><a href="#cb1-7"></a>              { <span class="fu">id</span>, name, city }</span></code></pre></div> '
