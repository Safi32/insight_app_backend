<h1>
    Insight App Backend
</h1>
<p>
To run for development, run these docker commands:
</p>
<code>
<ul>
    <li>
        docker build -t insight_app .
    </li>
    <li>
        docker run -d --name express-container -p 5432:5432 --env-file .env insight_app
    </li>
</ul>
</code>
