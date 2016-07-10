<?php

namespace App\Http\Controllers;

use App\Conference;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class ConferenceIntroductionController extends Controller
{
    public function index(Conference $conference)
    {
        return view('conferences.introduce')->with('conference', $conference);
    }
}
