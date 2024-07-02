
let db;

function fnAbrirDB(dbName, tabla) {
    return new Promise((resolve, reject) => {
        if (db) {
            resolve(db);
            return;
        }
        const request = indexedDB.open(dbName, 1);

        request.onerror = () => reject("Error al abrir la base de datos");
        request.onsuccess = () => {
            db = request.result;
            resolve(db);
        };
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            db.createObjectStore(tabla, { keyPath: "id", autoIncrement: true });
        };
    });
}

async function fnCrearItem(dbName, tabla, item) {
    await fnAbrirDB(dbName, tabla);
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([tabla], "readwrite");
        const store = transaction.objectStore(tabla);
        const request = store.add(item);

        request.onerror = () => reject("Error al crear el item");
        request.onsuccess = () => resolve(request.result);
    });
}

async function fnLeerItems(dbName, tabla) {
    await fnAbrirDB(dbName, tabla);
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([tabla], "readonly");
        const store = transaction.objectStore(tabla);
        const request = store.getAll();

        request.onerror = () => reject("Error al leer el item");
        request.onsuccess = () => resolve(request.result);
    });
}

async function fnActualizarItem(dbName, tabla, id, itemActualizado) {
    await fnAbrirDB(dbName, tabla);
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([tabla], "readwrite");
        const store = transaction.objectStore(tabla);
        const request = store.put({ ...itemActualizado, id });

        request.onerror = () => reject("Error al actualizar el item");
        request.onsuccess = () => resolve(request.result);
    });
}

async function fnEliminarItem(dbName, tabla, id) {
    await fnAbrirDB(dbName, tabla);
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([tabla], "readwrite");
        const store = transaction.objectStore(tabla);
        const request = store.delete(id);

        request.onerror = () => reject("Error al eliminar el item");
        request.onsuccess = () => resolve();
    });
}

export {
    fnAbrirDB,
    fnCrearItem,
    fnLeerItems,
    fnActualizarItem,
    fnEliminarItem,
}