using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using ServicioAlumnos.Models;

namespace ServicioAlumnos.Controllers
{
    public class alumnosController : ApiController
    {
        private ajaxEntities db = new ajaxEntities();

        // GET: api/alumnos
        public IQueryable<alumnos> Getalumnos()
        {
            return db.alumnos;
        }

        // GET: api/alumnos/5
        [ResponseType(typeof(alumnos))]
        public IHttpActionResult Getalumnos(int id)
        {
            alumnos alumnos = db.alumnos.Find(id);
            if (alumnos == null)
            {
                return NotFound();
            }

            return Ok(alumnos);
        }

        // PUT: api/alumnos/5
        [ResponseType(typeof(void))]
        public IHttpActionResult Putalumnos(int id, alumnos alumnos)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != alumnos.id)
            {
                return BadRequest();
            }

            db.Entry(alumnos).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!alumnosExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/alumnos
        [ResponseType(typeof(alumnos))]
        public IHttpActionResult Postalumnos(alumnos alumnos)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.alumnos.Add(alumnos);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = alumnos.id }, alumnos);
        }

        // DELETE: api/alumnos/5
        [ResponseType(typeof(alumnos))]
        public IHttpActionResult Deletealumnos(int id)
        {
            alumnos alumnos = db.alumnos.Find(id);
            if (alumnos == null)
            {
                return NotFound();
            }

            db.alumnos.Remove(alumnos);
            db.SaveChanges();

            return Ok(alumnos);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool alumnosExists(int id)
        {
            return db.alumnos.Count(e => e.id == id) > 0;
        }
    }
}