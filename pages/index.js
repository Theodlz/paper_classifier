import Head from "next/head";
import React from "react";
import styles from "../styles/Home.module.css";

import io from "socket.io-client";
let socket

export default function Home({}) {
  const [papers, setPapers] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [nbPerPage, setNbPerPage] = React.useState(10);
  const [allClassifications, setAllClassifications] = React.useState([]);

  const socketInitializer = async () => {
    await fetch('/api/socket')
    socket = io()

    socket.on('connect', () => {
      console.log('connected');
    })

    socket.on("disconnect", () => {
      // try to reconnect in 5 seconds
      setTimeout(socketInitializer, 5000)
    })

    socket.on('paper-updated', msg => {
        getPapers({ page, nbPerPage })
    })
  }

  const getAllClassifications = async ({}) => {
    const res = await fetch(`/api/classification`);
    const data = await res.json();
    setAllClassifications(data);
  };
  
  const getPapers = async ({ page = 1, nbPerPage = 10 }) => {
    const res = await fetch(`/api/paper?page=${page}&nbPerPage=${nbPerPage}`);
    const data = await res.json();
    setPapers(data);
  };
  
  const submitClassification = async ({ title, classifications }) => {
    const res = await fetch(`/api/classification`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, classifications }),
    });
    await res.json();
    socket.emit('paper-updated', { id: papers.find(paper => paper.title === title)?._id })
    getPapers({ page, nbPerPage })
  };

  React.useEffect(() => {
    socketInitializer();
    getAllClassifications();
  }, []);

  React.useEffect(() => {
    if (nbPerPage > 0) {
      getPapers({ page, nbPerPage });
    }
  }, [page, nbPerPage]);
  

  return (
    <div className={styles.container}>
      <Head>
        <title>ZTF-related papers classifier</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>ZTF-related papers classifier</h1>
        <div className={styles.pagination}>
          Page:
          <button onClick={() => page > 1 && setPage(page - 1)}>Previous</button>
          <input type="number" value={page} onChange={(e) => !isNaN(e.target.value) && setPage(parseInt(e.target.value))} />
          <button onClick={() => setPage(page + 1)}>Next</button>
          
          Papers per page:
          <input type="number" value={nbPerPage} onChange={(e) => (!isNaN(e.target.value) && e.target.value >= 0 && e.target.value <= 100) && setNbPerPage(parseInt(e.target.value))} />
        </div>
       <ul className={styles.papers}>
          {papers.map((paper) => (
            <li key={paper.title} className={styles.paper}>
              <h4>{paper.index}. {paper.title}</h4>
              <p>{paper.authors.join(", ")}</p>
              <p className={styles.paperText}>{paper.abstract}</p>
              <a className={styles.link} href={paper.url}> {paper.url}</a>
              <div className={styles.classifications}>
                <div className={styles.classificationLevel}>
                  <h3 className={styles.level}>Level 1</h3>
                  {allClassifications.slice(0, 2).map((classification) => (
                    <div key={classification}>
                      <input type="checkbox" id={classification} name={classification} value={classification}
                        checked={paper.classifications.includes(classification)}
                        onChange={(e) => {
                          const newClassifications = paper.classifications.includes(classification)
                            ? paper.classifications.filter((c) => c !== classification)
                            : [...paper.classifications, classification];
                          submitClassification({ title: paper.title, classifications: newClassifications });
                        }}
                      />
                          
                      <label htmlFor={classification}>{classification}</label>
                    </div>
                  ))}
                </div>
                <div className={styles.classificationLevel}>
                  <h4 className={styles.level}>Level 2</h4>
                  {allClassifications.slice(2, 6).map((classification) => (
                      <div key={classification}>
                        <input type="checkbox" id={classification} name={classification} value={classification}
                          checked={paper.classifications.includes(classification)}
                          onChange={(e) => {
                            const newClassifications = paper.classifications.includes(classification)
                              ? paper.classifications.filter((c) => c !== classification)
                              : [...paper.classifications, classification];
                            submitClassification({ title: paper.title, classifications: newClassifications });
                          }}
                        />
                        <label htmlFor={classification}>{classification}</label>
                      </div>
                    ))}
                </div> 
                <div className={styles.classificationLevel}>
                  <h5 className={styles.level}>Level 3</h5>
                  {allClassifications.slice(6, allClassifications?.length).map((classification) => (
                    <div key={classification}>
                    <input type="checkbox" id={classification} name={classification} value={classification}
                      checked={paper.classifications.includes(classification)}
                      onChange={(e) => {
                        const newClassifications = paper.classifications.includes(classification)
                          ? paper.classifications.filter((c) => c !== classification)
                          : [...paper.classifications, classification];
                        submitClassification({ title: paper.title, classifications: newClassifications });
                      }}
                    />
                    <label htmlFor={classification}>{classification}</label>
                  </div>
                  ))}
                </div>
              </div>
              <div className={styles.divider} />
            </li>
            // show a divider that takes the full width of the page
          ))}
          {papers.length === 0 && <li>No papers found for page {page} and nbPerPage {nbPerPage}</li>}
       </ul>
      </main>
    </div>
  );
}