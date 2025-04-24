<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    // Permitimos asignación masiva en los campos title y content
    protected $fillable = ['title', 'content'];
}

App\Models\Post::create([
    'title' => 'Mi primer post',
    'content' => 'Conectado con PostgreSQL'
  ]);

// Creamos un post con:
// App\Models\Post::create([
//     'title' => 'Mi segundo post',
//     'content' => 'Conectado con PostgreSQL'
//   ]);
// Leemos todos los post con:
//   App\Models\Post::all();

//   Bsuqeda por ID
//   App\Models\Post::find(1);


//   Encontramos y actualizamos un post
// $post = App\Models\Post::find(1);
// $post->title = 'Nuevo título';
// $post->save();

// Eliminamos un post:
// App\Models\Post::destroy(1);

//Todo por consola.