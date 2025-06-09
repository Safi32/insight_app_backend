<h1>
    Insight App Backend
</h1>
<p>
To run for development, run these docker commands:
</p>
<code>docker build -t insight_app .</code>
<code>docker run -d --name express-container -p 5432:5432 --env-file .env insight_app</code>
